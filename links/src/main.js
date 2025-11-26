import 'bootstrap/dist/css/bootstrap.min.css';
import './style.css';

document.querySelector('#app').innerHTML = `
  <div class="container-fluid">
    <div class="row">
      <!-- Sidebar -->
      <div class="col-md-3 col-lg-2 sidebar bg-light p-3">
        <h4 class="mb-4">
          <i class="bi bi-speedometer2"></i> Dashboard
        </h4>
        <ul class="nav nav-pills flex-column mb-4">
          <li class="nav-item">
            <a class="nav-link active" href="#" data-section="links">
              <i class="bi bi-link-45deg"></i> Links Manager
            </a>
          </li>
          <li class="nav-item">
            <a class="nav-link" href="#" data-section="notes">
              <i class="bi bi-sticky"></i> Quick Notes
            </a>
          </li>
        </ul>
        
        <!-- Quick Actions -->
        <div class="quick-actions">
          <button class="btn btn-primary btn-sm w-100 mb-2" id="addLinkBtn">
            <i class="bi bi-plus-circle"></i> Add Link
          </button>
          <button class="btn btn-success btn-sm w-100" id="addNoteBtn">
            <i class="bi bi-plus-circle"></i> Add Note
          </button>
        </div>
      </div>

      <!-- Main Content -->
      <div class="col-md-9 col-lg-10 content-area">
        <!-- Links Manager Section -->
        <div id="links-section" class="section">
          <div class="d-flex justify-content-between align-items-center mb-4">
            <h3><i class="bi bi-link-45deg"></i> Links Manager</h3>
          </div>
          
          <!-- Add Link Form -->
          <div class="card mb-4">
            <div class="card-header">
              <h5 class="mb-0">Add New Link</h5>
            </div>
            <div class="card-body">
              <form id="linkForm">
                <div class="row">
                  <div class="col-md-4">
                    <input type="text" class="form-control mb-2" id="linkTitle" placeholder="Link Title" required>
                  </div>
                  <div class="col-md-6">
                    <input type="url" class="form-control mb-2" id="linkUrl" placeholder="https://example.com" required>
                  </div>
                  <div class="col-md-2">
                    <button type="submit" class="btn btn-primary w-100">Add Link</button>
                  </div>
                </div>
              </form>
            </div>
          </div>

          <!-- Links List -->
          <div class="card">
            <div class="card-header">
              <h5 class="mb-0">Saved Links</h5>
            </div>
            <div class="card-body">
              <div id="linksList"></div>
            </div>
          </div>
        </div>

        <!-- Quick Notes Section -->
        <div id="notes-section" class="section d-none">
          <div class="d-flex justify-content-between align-items-center mb-4">
            <h3><i class="bi bi-sticky"></i> Quick Notes</h3>
          </div>
          
          <!-- Add Note Form -->
          <div class="card mb-4">
            <div class="card-header">
              <h5 class="mb-0">Create New Note</h5>
            </div>
            <div class="card-body">
              <form id="noteForm">
                <div class="mb-3">
                  <input type="text" class="form-control mb-2" id="noteTitle" placeholder="Note Title" required>
                </div>
                <div class="mb-3">
                  <textarea class="form-control" id="noteContent" rows="3" placeholder="Write your note here..." required></textarea>
                </div>
                <button type="submit" class="btn btn-success">Save Note</button>
              </form>
            </div>
          </div>

          <!-- Notes List -->
          <div class="card">
            <div class="card-header">
              <h5 class="mb-0">Your Notes</h5>
            </div>
            <div class="card-body">
              <div id="notesList"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
`;

// Dashboard functionality
class Dashboard {
  constructor() {
    this.links = JSON.parse(localStorage.getItem('dashboard-links')) || [];
    this.notes = JSON.parse(localStorage.getItem('dashboard-notes')) || [];
    this.init();
  }

  init() {
    this.bindEvents();
    this.showSection('links');
    this.renderLinks();
    this.renderNotes();
  }

  bindEvents() {
    // Navigation
    document.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        document.querySelectorAll('.nav-link').forEach(nav => nav.classList.remove('active'));
        e.target.classList.add('active');
        this.showSection(e.target.dataset.section);
      });
    });

    // Quick action buttons
    document.getElementById('addLinkBtn').addEventListener('click', () => {
      this.showSection('links');
      document.getElementById('linkTitle').focus();
    });

    document.getElementById('addNoteBtn').addEventListener('click', () => {
      this.showSection('notes');
      document.getElementById('noteTitle').focus();
    });

    // Forms
    document.getElementById('linkForm').addEventListener('submit', (e) => this.handleAddLink(e));
    document.getElementById('noteForm').addEventListener('submit', (e) => this.handleAddNote(e));
  }

  showSection(section) {
    document.querySelectorAll('.section').forEach(sec => sec.classList.add('d-none'));
    document.getElementById(`${section}-section`).classList.remove('d-none');
  }

  // Links functionality
  handleAddLink(e) {
    e.preventDefault();
    const title = document.getElementById('linkTitle').value;
    const url = document.getElementById('linkUrl').value;

    const link = {
      id: Date.now(),
      title,
      url,
      createdAt: new Date().toLocaleString()
    };

    this.links.push(link);
    this.saveLinks();
    this.renderLinks();
    
    // Reset form
    e.target.reset();
    document.getElementById('linkTitle').focus();
  }

  deleteLink(id) {
    this.links = this.links.filter(link => link.id !== id);
    this.saveLinks();
    this.renderLinks();
  }

  saveLinks() {
    localStorage.setItem('dashboard-links', JSON.stringify(this.links));
  }

  renderLinks() {
    const container = document.getElementById('linksList');
    
    if (this.links.length === 0) {
      container.innerHTML = `
        <div class="empty-state">
          <i class="bi bi-link-45deg" style="font-size: 3rem;"></i>
          <p class="mt-3">No links saved yet. Add your first link above!</p>
        </div>
      `;
      return;
    }

    container.innerHTML = this.links.map(link => `
      <div class="link-item mb-3 p-3 border rounded">
        <div class="d-flex justify-content-between align-items-start">
          <div class="flex-grow-1">
            <h6 class="mb-1">${link.title}</h6>
            <a href="${link.url}" target="_blank" class="text-muted small">${link.url}</a>
            <div class="text-muted small mt-1">Added: ${link.createdAt}</div>
          </div>
          <button class="btn btn-outline-danger btn-sm ms-2 delete-link" data-id="${link.id}">
            Delete
          </button>
        </div>
      </div>
    `).join('');

    // Add event listeners to delete buttons
    container.querySelectorAll('.delete-link').forEach(button => {
      button.addEventListener('click', (e) => {
        const id = parseInt(e.target.closest('.delete-link').dataset.id);
        this.deleteLink(id);
      });
    });
  }

  // Notes functionality
  handleAddNote(e) {
    e.preventDefault();
    const title = document.getElementById('noteTitle').value;
    const content = document.getElementById('noteContent').value;

    const note = {
      id: Date.now(),
      title,
      content,
      createdAt: new Date().toLocaleString()
    };

    this.notes.push(note);
    this.saveNotes();
    this.renderNotes();
    
    // Reset form
    e.target.reset();
    document.getElementById('noteTitle').focus();
  }

  deleteNote(id) {
    this.notes = this.notes.filter(note => note.id !== id);
    this.saveNotes();
    this.renderNotes();
  }

  saveNotes() {
    localStorage.setItem('dashboard-notes', JSON.stringify(this.notes));
  }

  renderNotes() {
    const container = document.getElementById('notesList');
    
    if (this.notes.length === 0) {
      container.innerHTML = `
        <div class="empty-state">
          <i class="bi bi-sticky" style="font-size: 3rem;"></i>
          <p class="mt-3">No notes created yet. Write your first note above!</p>
        </div>
      `;
      return;
    }

    container.innerHTML = this.notes.map(note => `
      <div class="note-item mb-3 p-3 border rounded">
        <div class="d-flex justify-content-between align-items-start">
          <div class="flex-grow-1">
            <h6 class="mb-2">${note.title}</h6>
            <p class="mb-2">${note.content}</p>
            <div class="text-muted small">Created: ${note.createdAt}</div>
          </div>
          <button class="btn btn-outline-danger btn-sm ms-2 delete-note" data-id="${note.id}">
            Delete
          </button>
        </div>
      </div>
    `).join('');

    // Add event listeners to delete buttons
    container.querySelectorAll('.delete-note').forEach(button => {
      button.addEventListener('click', (e) => {
        const id = parseInt(e.target.closest('.delete-note').dataset.id);
        this.deleteNote(id);
      });
    });
  }
}

// Initialize dashboard
const dashboard = new Dashboard();