import React, { useState, useEffect } from 'react';
import { Plus, Upload, Download, Edit, Trash2, Search, Filter, Tag } from 'lucide-react';
import { contactService } from '../services/api';
import LoadingSpinner from '../components/loading-spinner';

/**
 * Contacts page component for managing customer contacts
 * @param {Object} props - Component props
 * @param {Object} props.user - Current user data
 */
const Contacts = ({ user }) => {
  const [contacts, setContacts] = useState([]);
  const [filteredContacts, setFilteredContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [tagFilter, setTagFilter] = useState('');
  const [availableTags, setAvailableTags] = useState([]);
  const [stats, setStats] = useState({});
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showImportModal, setShowImportModal] = useState(false);

  /**
   * Load contacts and related data on component mount
   */
  useEffect(() => {
    loadContactsData();
  }, []);

  /**
   * Filter contacts when search or filter changes
   */
  useEffect(() => {
    filterContacts();
  }, [contacts, searchQuery, tagFilter]);

  /**
   * Fetch all contacts data from API
   */
  const loadContactsData = async () => {
    try {
      setLoading(true);
      const [contactsData, tagsData, statsData] = await Promise.all([
        contactService.getContacts(),
        contactService.getTags(),
        contactService.getStats()
      ]);
      
      setContacts(contactsData);
      setAvailableTags(tagsData);
      setStats(statsData);
    } catch (err) {
      setError('Failed to load contacts data');
      console.error('Contacts loading error:', err);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Filter contacts based on search query and tag filter
   */
  const filterContacts = () => {
    let filtered = contacts;

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(contact =>
        contact.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        contact.phone.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (contact.email && contact.email.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }

    // Filter by tag
    if (tagFilter) {
      filtered = filtered.filter(contact =>
        contact.tags && contact.tags.includes(tagFilter)
      );
    }

    setFilteredContacts(filtered);
  };

  /**
   * Handle contact deletion
   * @param {number} contactId - Contact ID
   */
  const handleDeleteContact = async (contactId) => {
    if (!window.confirm('Are you sure you want to delete this contact?')) {
      return;
    }

    try {
      await contactService.deleteContact(contactId);
      await loadContactsData();
    } catch (err) {
      setError(`Failed to delete contact: ${err.message}`);
    }
  };

  /**
   * Handle bulk import
   * @param {Array} importedContacts - Array of contact objects
   */
  const handleBulkImport = async (importedContacts) => {
    try {
      const result = await contactService.bulkImport(importedContacts);
      await loadContactsData();
      setShowImportModal(false);
      
      // Show import results
      if (result.results.errors.length > 0) {
        setError(`Import completed with errors: ${result.results.errors.slice(0, 3).join(', ')}`);
      }
    } catch (err) {
      setError(`Failed to import contacts: ${err.message}`);
    }
  };

  /**
   * Format phone number for display
   * @param {string} phone - Phone number
   */
  const formatPhone = (phone) => {
    // Basic phone formatting
    return phone.replace(/(\d{1,3})(\d{3})(\d{3})(\d{4})/, '+$1 $2 $3 $4');
  };

  /**
   * Format date for display
   * @param {string} dateString - ISO date string
   */
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold ">Contacts</h1>
          <p className=" mt-1">
            Manage and organize your customer contact database
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowImportModal(true)}
            className="btn btn-secondary flex items-center gap-2"
          >
            <Upload className="w-4 h-4" />
            Import
          </button>
          <button
            onClick={() => setShowCreateModal(true)}
            className="btn btn-primary flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Add Contact
          </button>
        </div>
      </div>

      {/* Error message */}
      {error && (
        <div className="alert alert-error">
          {error}
        </div>
      )}

      {/* Statistics cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="card">
          <div className="card-body">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm ">Total Contacts</p>
                <p className="text-2xl font-bold ">{stats.total_contacts || 0}</p>
              </div>
              <div className="w-12 h-12 -100 rounded-lg flex items-center justify-center">
                <Tag className="w-6 h-6 text-primary-600" />
              </div>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="card-body">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm ">Opted In</p>
                <p className="text-2xl font-bold ">{stats.opted_in_contacts || 0}</p>
              </div>
              <div className="w-12 h-12 bg-success-100 rounded-lg flex items-center justify-center">
                <Tag className="w-6 h-6 text-success-600" />
              </div>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="card-body">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm ">Recent Contacts</p>
                <p className="text-2xl font-bold ">{stats.recent_contacts || 0}</p>
                <p className="text-xs ">Last 30 days</p>
              </div>
              <div className="w-12 h-12 bg-warning-100 rounded-lg flex items-center justify-center">
                <Tag className="w-6 h-6 text-warning-600" />
              </div>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="card-body">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm ">Opt-in Rate</p>
                <p className="text-2xl font-bold ">{stats.opt_in_rate || 0}%</p>
              </div>
              <div className="w-12 h-12 bg-error-100 rounded-lg flex items-center justify-center">
                <Tag className="w-6 h-6 text-error-600" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Search and filters */}
      <div className="card">
        <div className="card-body">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 " />
                <input
                  type="text"
                  placeholder="Search contacts by name, phone, or email..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="form-input pl-10"
                />
              </div>
            </div>

            {/* Tag filter */}
            <div className="md:w-48">
              <div className="relative">
                <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 " />
                <select
                  value={tagFilter}
                  onChange={(e) => setTagFilter(e.target.value)}
                  className="form-select pl-10"
                >
                  <option value="">All Tags</option>
                  {availableTags.map(tag => (
                    <option key={tag} value={tag}>{tag}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Export button */}
            <button className="btn btn-secondary flex items-center gap-2">
              <Download className="w-4 h-4" />
              Export
            </button>
          </div>
        </div>
      </div>

      {/* Contacts table */}
      <div className="card">
        <div className="card-body p-0">
          {filteredContacts.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="table">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Phone</th>
                    <th>Email</th>
                    <th>Tags</th>
                    <th>Status</th>
                    <th>Added</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredContacts.map((contact) => (
                    <tr key={contact.id}>
                      <td>
                        <div className="font-medium ">{contact.name}</div>
                      </td>
                      <td>
                        <span className="text-sm ">
                          {formatPhone(contact.phone)}
                        </span>
                      </td>
                      <td>
                        <span className="text-sm ">
                          {contact.email || '-'}
                        </span>
                      </td>
                      <td>
                        <div className="flex flex-wrap gap-1">
                          {contact.tags && contact.tags.length > 0 ? (
                            contact.tags.slice(0, 2).map(tag => (
                              <span key={tag} className="badge badge-gray text-xs">
                                {tag}
                              </span>
                            ))
                          ) : (
                            <span className="text-sm ">No tags</span>
                          )}
                          {contact.tags && contact.tags.length > 2 && (
                            <span className="text-xs ">
                              +{contact.tags.length - 2} more
                            </span>
                          )}
                        </div>
                      </td>
                      <td>
                        <span className={`badge ${
                          contact.opt_in_status ? 'badge-success' : 'badge-warning'
                        }`}>
                          {contact.opt_in_status ? 'Opted In' : 'Opted Out'}
                        </span>
                      </td>
                      <td className="text-sm ">
                        {formatDate(contact.created_at)}
                      </td>
                      <td>
                        <div className="flex items-center gap-2">
                          <button
                            className="btn btn-sm btn-secondary"
                            title="Edit contact"
                          >
                            <Edit className="w-3 h-3" />
                          </button>
                          <button
                            onClick={() => handleDeleteContact(contact.id)}
                            className="btn btn-sm btn-danger"
                            title="Delete contact"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="w-16 h-16  rounded-full flex items-center justify-center mx-auto mb-4">
                <Plus className="w-8 h-8 " />
              </div>
              <h3 className="text-lg font-medium  mb-2">No contacts found</h3>
              <p className=" mb-4">
                {contacts.length === 0 
                  ? "Add your first contact to get started"
                  : "Try adjusting your search or filter criteria"
                }
              </p>
              <div className="flex items-center justify-center gap-3">
                <button
                  onClick={() => setShowCreateModal(true)}
                  className="btn btn-primary"
                >
                  Add Contact
                </button>
                <button
                  onClick={() => setShowImportModal(true)}
                  className="btn btn-secondary"
                >
                  Import Contacts
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Create contact modal placeholder */}
      {showCreateModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="card-header">
              <h3 className="font-semibold ">Add New Contact</h3>
            </div>
            <div className="card-body">
              <p className="">Contact creation form will be implemented here.</p>
            </div>
            <div className="card-footer flex justify-end gap-3">
              <button
                onClick={() => setShowCreateModal(false)}
                className="btn btn-secondary"
              >
                Cancel
              </button>
              <button className="btn btn-primary">
                Add Contact
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Import contacts modal placeholder */}
      {showImportModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="card-header">
              <h3 className="font-semibold ">Import Contacts</h3>
            </div>
            <div className="card-body">
              <p className="">Contact import functionality will be implemented here.</p>
            </div>
            <div className="card-footer flex justify-end gap-3">
              <button
                onClick={() => setShowImportModal(false)}
                className="btn btn-secondary"
              >
                Cancel
              </button>
              <button className="btn btn-primary">
                Import
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Contacts;