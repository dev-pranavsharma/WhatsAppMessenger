import React, { useState, useEffect } from 'react';
import { Plus, Upload, Download, Edit, Trash2, Search, Filter, Tag } from 'lucide-react';
import { contactService } from '../services/api';
import LoadingSpinner from '../components/loading-spinner';
import { Button } from '@/components/ui/button';
import { Card, CardAction, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/Input';
import { Select, SelectItem, SelectTrigger,SelectContent, SelectValue, SelectGroup, SelectLabel} from '@/components/ui/select';
import { Link } from 'react-router-dom';

const Contacts = ({ user }) => {
  const [contacts, setContacts] = useState([]);
  const [filteredContacts, setFilteredContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [tagFilter, setTagFilter] = useState('');
  const [availableTags, setAvailableTags] = useState([{value:'market' ,title:"marketing"}]);
  const [stats, setStats] = useState({});
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showImportModal, setShowImportModal] = useState(false);


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
          <Button
            variant='outline'
            onClick={() => setShowImportModal(true)}
          >
            <Download className="w-4 h-4" />
           
            Import
          </Button>
          <Button variant='outline'>
               <Upload className="w-4 h-4" />
              Export
            </Button>
          <Button
            asChild
          >
            <Link to='/contacts/add'>
            <Plus className="w-4 h-4" />
            Add Contact
            </Link>
          </Button>
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
        <Card>
          <CardHeader className="card-body">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>{stats.total_contacts || 0}</CardTitle>
                <CardDescription>Total Contacts</CardDescription>
              </div>
              <div className="w-12 h-12 -100 rounded-lg flex items-center justify-center">
                <Tag className="w-6 h-6 text-primary-600" />
              </div>
            </div>
          </CardHeader>
        </Card>
           <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 " />
                <Input
                  type="text"
                  placeholder="Search contacts by name, phone, or email..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="form-input pl-10"
                />
              </div>
            </div>
            </div>

            {/* Tag filter */}
            <div className="md:w-48">
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder='Select Tag'/>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel> Tags</SelectLabel>
                     {availableTags.map(tag => (
                     <SelectItem value={tag.value}>{tag.title}</SelectItem>
                  ))}
                   </SelectGroup>
                  </SelectContent>
                </Select>
            </div>

            {/* Export button */}
      </div>
    </div>
  );
};

export default Contacts;