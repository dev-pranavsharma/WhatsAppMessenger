import React, { useState, useEffect } from 'react';
import { Plus, Upload, Download, Edit, Trash2, Search, Filter, Tag } from 'lucide-react';
import { contactService } from '../services/api';
import LoadingSpinner from '../components/loading-spinner';
import { Button } from '@/components/ui/button';
import { Card, CardAction, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/Input';
import { Select, SelectItem, SelectTrigger,SelectContent, SelectValue, SelectGroup, SelectLabel} from '@/components/ui/select';
import { Link } from 'react-router-dom';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { useQuery, useQueryClient } from '@tanstack/react-query';



const Contacts = ({ user }) => {
  const queryClient = useQueryClient()
  const session = queryClient.getQueryData(['session'])
  const { data: active_phone_number } = useQuery({
    queryKey: ['active_phone_number'],
    queryFn: () => undefined,
    enabled: false,
  })
  const tenant = session?.tenant
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [tagFilter, setTagFilter] = useState('');
  const [availableTags, setAvailableTags] = useState([{value:'market' ,title:"marketing"}]);
  const [stats, setStats] = useState({});
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showImportModal, setShowImportModal] = useState(false);
  


   const { data: contacts } = useQuery({
    queryKey: [`contacts_${tenant?.id}_${active_phone_number?.id}`],
    queryFn:async () => {
      const response = await contactService.contactsList({t_id:tenant?.id,pn_id:active_phone_number?.id})
      return response.data
    },
    enabled: Boolean(active_phone_number?.id),
    staleTime: Infinity,
  })
  console.log(tenant,active_phone_number,contacts);

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
      <Table>
  <TableCaption>A list of your recent invoices.</TableCaption>
  <TableHeader>
    <TableRow>
      <TableHead className="w-[100px]">Invoice</TableHead>
      <TableHead>Status</TableHead>
      <TableHead>Method</TableHead>
      <TableHead className="text-right">Amount</TableHead>
    </TableRow>
  </TableHeader>
  <TableBody>
    <TableRow>
      <TableCell className="font-medium">INV001</TableCell>
      <TableCell>Paid</TableCell>
      <TableCell>Credit Card</TableCell>
      <TableCell className="text-right">$250.00</TableCell>
    </TableRow>
  </TableBody>
</Table>
    </div>
  );
};

export default Contacts;