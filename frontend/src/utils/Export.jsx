import React, { useState, useRef } from 'react';
import { Download, Upload, Users, FileSpreadsheet, CheckCircle, AlertCircle } from 'lucide-react';

const ExcelContactManager = () => {
  const [importedData, setImportedData] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [importStatus, setImportStatus] = useState(null);
  const [showManualEntry, setShowManualEntry] = useState(false);
  const [manualContacts, setManualContacts] = useState([]);
  const fileInputRef = useRef(null);

  // Country codes that would typically come from your API
  const countryCodes = [
    { code: '+1', name: 'United States' },
    { code: '+91', name: 'India' },
    { code: '+44', name: 'United Kingdom' },
    { code: '+49', name: 'Germany' },
    { code: '+33', name: 'France' },
    { code: '+86', name: 'China' },
    { code: '+81', name: 'Japan' },
    { code: '+61', name: 'Australia' },
    { code: '+7', name: 'Russia' },
    { code: '+55', name: 'Brazil' }
  ];

  const generateExcelTemplate = async () => {
    try {
      // Import ExcelJS from CDN - correct way for browser
      const script = document.createElement('script');
      script.src = 'https://cdnjs.cloudflare.com/ajax/libs/exceljs/4.3.0/exceljs.min.js';
      
      // Wait for script to load
      await new Promise((resolve, reject) => {
        script.onload = resolve;
        script.onerror = reject;
        document.head.appendChild(script);
      });

      // Now ExcelJS should be available globally
      const workbook = new window.ExcelJS.Workbook();
      const ws = workbook.addWorksheet("Contact Template");

      // Define headers with user-friendly names
      const headers = [
        'Full Name *',
        'Gender *',
        'Phone Number *',
        'Country Code *',
        'Email',
        'Occupation',
        'Birthday (YYYY-MM-DD)',
        'Company Name',
        'Engagement Date (YYYY-MM-DD)',
        'Anniversary Date (YYYY-MM-DD)',
        'Address Line 1',
        'Address Line 2',
        'City',
        'State',
        'Country Code (Address)',
        'Pincode'
      ];

      // Add header row
      ws.addRow(headers);

      // Set column widths - exactly like your example
      ws.columns.forEach((col) => {
        col.width = 18;
      });

      // Define dropdown options exactly like your example
      const genderOptions = ["M", "F", "Other"];
      const phoneCountryCodes = ["+1", "+91", "+44", "+49", "+33", "+86", "+81", "+61", "+7", "+55", "+34", "+39", "+31", "+46", "+47", "+41", "+32", "+43", "+45"];
      const addressCountryCodes = ["US", "IN", "GB", "DE", "FR", "CN", "JP", "AU", "RU", "BR", "ES", "IT", "NL", "SE", "NO", "CH", "BE", "AT", "DK"];

      // Add dropdowns using the EXACT same pattern as your working example
      // Gender dropdown (Column B) - exactly like your example
      ws.dataValidations.add("B2:B9999", {
        type: "list",
        allowBlank: false,
        formulae: [`"${genderOptions.join(",")}"`],
      });

      // Phone Country Code dropdown (Column D) - exactly like your example
      ws.dataValidations.add("D2:D9999", {
        type: "list",
        allowBlank: false,
        formulae: [`"${phoneCountryCodes.join(",")}"`],
      });

      // Address Country Code dropdown (Column O) - exactly like your example
      ws.dataValidations.add("O2:O9999", {
        type: "list",
        allowBlank: false,
        formulae: [`"${addressCountryCodes.join(",")}"`],
      });

      // Header styling - exactly like your example
      ws.getRow(1).fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: "FFADD8E6" },
      };

      // Apply font and alignment to all cells - exactly like your example
      ws.eachRow((row) => {
        row.eachCell((cell) => {
          cell.font = { name: "Inter", size: 8 };
          cell.alignment = { horizontal: "center" };
        });
      });

      // Create instructions worksheet
      const instructionsWs = workbook.addWorksheet("Instructions");
      
      const instructions = [
        ['📋 CONTACT TEMPLATE INSTRUCTIONS'],
        [''],
        ['✅ WORKING DROPDOWNS INCLUDED!'],
        ['This template has fully functional dropdowns that work on Mac, PC, and web Excel.'],
        [''],
        ['🔧 HOW TO USE:'],
        ['1. Start adding your contacts from row 2'],
        ['2. Click on Gender cells (column B) to see dropdown with M, F, Other'],
        ['3. Click on Country Code cells (column D) to see dropdown with country codes'],
        ['4. Select values from dropdowns instead of typing'],
        ['5. Fill all required fields marked with *'],
        [''],
        ['📝 REQUIRED FIELDS (marked with *):'],
        ['• Full Name: Complete name of the person'],
        ['• Gender: Select M, F, or Other from dropdown'],
        ['• Phone Number: Numbers only (no country code)'],
        ['• Country Code: Select from dropdown (+91, +1, +44, etc.)'],
        [''],
        ['📋 OPTIONAL FIELDS:'],
        ['• Email: Valid email address'],
        ['• Occupation: Job title or profession'],
        ['• Birthday: Format YYYY-MM-DD (e.g., 1990-12-25)'],
        ['• Company Name: Current workplace'],
        ['• Engagement/Anniversary: Format YYYY-MM-DD'],
        ['• Address Fields: Complete address information'],
        [''],
        ['🌍 AVAILABLE OPTIONS:'],
        [''],
        ['GENDER OPTIONS:'],
        ['• M (Male)'],
        ['• F (Female)'],
        ['• Other'],
        [''],
        ['COUNTRY CODES:'],
        ['+1 - United States/Canada'],
        ['+91 - India'],
        ['+44 - United Kingdom'],
        ['+49 - Germany'],
        ['+33 - France'],
        ['+86 - China'],
        ['+81 - Japan'],
        ['+61 - Australia'],
        ['+7 - Russia'],
        ['+55 - Brazil'],
        ['+34 - Spain'],
        ['+39 - Italy'],
        ['+31 - Netherlands'],
        ['+46 - Sweden'],
        ['+47 - Norway'],
        ['+41 - Switzerland'],
        ['+32 - Belgium'],
        ['+43 - Austria'],
        ['+45 - Denmark'],
        [''],
        ['💾 BEFORE IMPORTING:'],
        ['✓ Fill all required fields'],
        ['✓ Use only dropdown selections for Gender and Country Code'],
        ['✓ Follow date format YYYY-MM-DD'],
        ['✓ Save as Excel (.xlsx) format'],
        ['✓ Import back to the application']
      ];

      instructions.forEach(instruction => {
        instructionsWs.addRow(instruction);
      });

      // Style instructions sheet
      instructionsWs.getColumn(1).width = 80;
      instructionsWs.getRow(1).font = { bold: true, size: 14, color: { argb: "FF1f4e79" } };
      instructionsWs.getRow(3).font = { bold: true, color: { argb: "FF2e7d32" } };

      // Generate and download file - exactly like your example
      const buffer = await workbook.xlsx.writeBuffer();
      const blob = new Blob([buffer], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });
      const url = URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = url;
      link.download = `contact_template_${new Date().toISOString().split('T')[0]}.xlsx`;
      document.body.appendChild(link);
      link.click();

      URL.revokeObjectURL(url);
      document.body.removeChild(link);

      // Clean up script
      document.head.removeChild(script);

      setImportStatus({
        type: 'success',
        message: 'Excel template with working dropdowns downloaded successfully!'
      });

    } catch (error) {
      console.error('Error generating Excel template:', error);
      setImportStatus({
        type: 'error',
        message: 'Error generating Excel template. Please try again.'
      });
    }
  };

  const handleFileImport = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setIsProcessing(true);
    setImportStatus(null);

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: 'array' });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

        // Skip header row and process data
        const contacts = jsonData.slice(1).filter(row => row.length > 0 && row[0]).map((row, index) => {
          return {
            rowNumber: index + 2, // +2 because we skip header and array is 0-indexed
            fullName: row[0] || '',
            gender: row[1] || '',
            phoneNumber: row[2] || '',
            countryCode: row[3] || '',
            email: row[4] || '',
            occupation: row[5] || '',
            birthday: row[6] || '',
            companyName: row[7] || '',
            engagement: row[8] || '',
            anniversary: row[9] || '',
            addressLine1: row[10] || '',
            addressLine2: row[11] || '',
            city: row[12] || '',
            state: row[13] || '',
            addressCountryCode: row[14] || '',
            pincode: row[15] || ''
          };
        });

        setImportedData(contacts);
        setImportStatus({
          type: 'success',
          message: `Successfully imported ${contacts.length} contacts`
        });
      } catch (error) {
        setImportStatus({
          type: 'error',
          message: 'Error reading file. Please ensure it\'s a valid Excel file.'
        });
      } finally {
        setIsProcessing(false);
      }
    };

    reader.readAsArrayBuffer(file);
    event.target.value = ''; // Reset input
  };

  const convertToApiFormat = (contact) => {
    const formatDate = (dateStr) => {
      if (!dateStr) return null;
      try {
        return new Date(dateStr).toISOString();
      } catch {
        return null;
      }
    };

    return {
      t_id: Math.floor(Math.random() * 1000000), // You might want to generate this differently
      waba_id: "2091822651310467", // This should come from your system
      pn_id: "722191280977160", // This should come from your system
      gender: contact.gender,
      full_name: contact.fullName,
      country_code: contact.countryCode,
      phone_number: contact.phoneNumber,
      email: contact.email,
      personal_details: {
        occupation: contact.occupation || null,
        birthday: formatDate(contact.birthday),
        company_name: contact.companyName || null,
        engagement: formatDate(contact.engagement),
        anniversary: formatDate(contact.anniversary)
      },
      address_details: {
        address_line_1: contact.addressLine1 || "",
        address_line_2: contact.addressLine2 || "",
        state: contact.state || "",
        country_code: contact.addressCountryCode || "IN",
        city: contact.city || "",
        pincode: contact.pincode || ""
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      __v: 0
    };
  };

  const addManualContact = () => {
    const newContact = {
      id: Date.now(),
      fullName: '',
      gender: '',
      phoneNumber: '',
      countryCode: '',
      email: '',
      occupation: '',
      birthday: '',
      companyName: '',
      engagement: '',
      anniversary: '',
      addressLine1: '',
      addressLine2: '',
      city: '',
      state: '',
      addressCountryCode: 'IN',
      pincode: ''
    };
    setManualContacts([...manualContacts, newContact]);
  };

  const updateManualContact = (id, field, value) => {
    setManualContacts(manualContacts.map(contact => 
      contact.id === id ? { ...contact, [field]: value } : contact
    ));
  };

  const removeManualContact = (id) => {
    setManualContacts(manualContacts.filter(contact => contact.id !== id));
  };

  const processContacts = () => {
    const allContacts = [...importedData, ...manualContacts];
    const apiFormatContacts = allContacts.map(convertToApiFormat);
    console.log('Contacts ready for API:', apiFormatContacts);
    
    // Here you would typically send this data to your API
    // Example:
    // const response = await fetch('/api/contacts/bulk', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify(apiFormatContacts)
    // });

    setImportStatus({
      type: 'success',
      message: `${apiFormatContacts.length} contacts processed and ready for API submission`
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-8 py-6">
            <div className="flex items-center space-x-3">
              <FileSpreadsheet className="h-8 w-8 text-white" />
              <div>
                <h1 className="text-2xl font-bold text-white">Excel Contact Manager</h1>
                <p className="text-blue-100 mt-1">Generate template, import contacts, and process bulk data</p>
              </div>
            </div>
          </div>

          <div className="p-8">
            {/* Action Buttons */}
            <div className="grid md:grid-cols-3 gap-6 mb-8">
              {/* Download Template */}
              <div className="bg-green-50 border border-green-200 rounded-xl p-6">
                <div className="flex items-center space-x-3 mb-4">
                  <Download className="h-6 w-6 text-green-600" />
                  <h2 className="text-lg font-semibold text-green-800">Step 1: Download Template</h2>
                </div>
                <p className="text-green-700 mb-4">
                  Download the Excel template with pre-configured dropdowns for gender and country codes.
                </p>
                <button
                  onClick={generateExcelTemplate}
                  className="w-full bg-green-600 hover:bg-green-700 text-white font-medium py-3 px-4 rounded-lg transition-colors flex items-center justify-center space-x-2"
                >
                  <Download className="h-4 w-4" />
                  <span>Download Excel Template</span>
                </button>
              </div>

              {/* Import Contacts */}
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
                <div className="flex items-center space-x-3 mb-4">
                  <Upload className="h-6 w-6 text-blue-600" />
                  <h2 className="text-lg font-semibold text-blue-800">Step 2: Import Filled Data</h2>
                </div>
                <p className="text-blue-700 mb-4">
                  Upload your filled Excel file to import all contacts at once.
                </p>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileImport}
                  accept=".xlsx,.xls"
                  className="hidden"
                />
                <button
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isProcessing}
                  className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-medium py-3 px-4 rounded-lg transition-colors flex items-center justify-center space-x-2"
                >
                  <Upload className="h-4 w-4" />
                  <span>{isProcessing ? 'Processing...' : 'Import Excel File'}</span>
                </button>
              </div>

              {/* Manual Entry */}
              <div className="bg-purple-50 border border-purple-200 rounded-xl p-6">
                <div className="flex items-center space-x-3 mb-4">
                  <Users className="h-6 w-6 text-purple-600" />
                  <h2 className="text-lg font-semibold text-purple-800">Option: Manual Entry</h2>
                </div>
                <p className="text-purple-700 mb-4">
                  Add contacts directly with dropdown selections for gender and country codes.
                </p>
                <button
                  onClick={() => setShowManualEntry(!showManualEntry)}
                  className="w-full bg-purple-600 hover:bg-purple-700 text-white font-medium py-3 px-4 rounded-lg transition-colors flex items-center justify-center space-x-2"
                >
                  <Users className="h-4 w-4" />
                  <span>{showManualEntry ? 'Hide Manual Entry' : 'Add Contacts Manually'}</span>
                </button>
              </div>
            </div>

            {/* Manual Contact Entry Form */}
            {showManualEntry && (
              <div className="bg-white border border-gray-200 rounded-xl p-6 mb-8">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-semibold text-gray-800">Manual Contact Entry</h3>
                  <button
                    onClick={addManualContact}
                    className="bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
                  >
                    + Add New Contact
                  </button>
                </div>

                {manualContacts.map((contact) => (
                  <div key={contact.id} className="bg-gray-50 rounded-lg p-6 mb-4 border">
                    <div className="flex justify-between items-start mb-4">
                      <h4 className="font-semibold text-gray-700">Contact #{manualContacts.indexOf(contact) + 1}</h4>
                      <button
                        onClick={() => removeManualContact(contact.id)}
                        className="text-red-600 hover:text-red-800 font-medium"
                      >
                        Remove
                      </button>
                    </div>

                    {/* Basic Information */}
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Full Name *</label>
                        <input
                          type="text"
                          value={contact.fullName}
                          onChange={(e) => updateManualContact(contact.id, 'fullName', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="Enter full name"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Gender *</label>
                        <select
                          value={contact.gender}
                          onChange={(e) => updateManualContact(contact.id, 'gender', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                          <option value="">Select Gender</option>
                          <option value="M">Male</option>
                          <option value="F">Female</option>
                          <option value="Other">Other</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Country Code *</label>
                        <select
                          value={contact.countryCode}
                          onChange={(e) => updateManualContact(contact.id, 'countryCode', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                          <option value="">Select Country Code</option>
                          {countryCodes.map((country) => (
                            <option key={country.code} value={country.code}>
                              {country.code} - {country.name}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number *</label>
                        <input
                          type="text"
                          value={contact.phoneNumber}
                          onChange={(e) => updateManualContact(contact.id, 'phoneNumber', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="Phone number"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                        <input
                          type="email"
                          value={contact.email}
                          onChange={(e) => updateManualContact(contact.id, 'email', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="Email address"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Occupation</label>
                        <input
                          type="text"
                          value={contact.occupation}
                          onChange={(e) => updateManualContact(contact.id, 'occupation', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="Job title"
                        />
                      </div>
                    </div>

                    {/* Personal Details */}
                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Birthday</label>
                        <input
                          type="date"
                          value={contact.birthday}
                          onChange={(e) => updateManualContact(contact.id, 'birthday', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Company Name</label>
                        <input
                          type="text"
                          value={contact.companyName}
                          onChange={(e) => updateManualContact(contact.id, 'companyName', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="Company name"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Engagement Date</label>
                        <input
                          type="date"
                          value={contact.engagement}
                          onChange={(e) => updateManualContact(contact.id, 'engagement', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Anniversary Date</label>
                        <input
                          type="date"
                          value={contact.anniversary}
                          onChange={(e) => updateManualContact(contact.id, 'anniversary', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                    </div>

                    {/* Address Details */}
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Address Line 1</label>
                        <input
                          type="text"
                          value={contact.addressLine1}
                          onChange={(e) => updateManualContact(contact.id, 'addressLine1', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="Street address"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Address Line 2</label>
                        <input
                          type="text"
                          value={contact.addressLine2}
                          onChange={(e) => updateManualContact(contact.id, 'addressLine2', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="Apartment, suite, etc."
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                        <input
                          type="text"
                          value={contact.city}
                          onChange={(e) => updateManualContact(contact.id, 'city', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="City"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">State</label>
                        <input
                          type="text"
                          value={contact.state}
                          onChange={(e) => updateManualContact(contact.id, 'state', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="State"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Country Code</label>
                        <select
                          value={contact.addressCountryCode}
                          onChange={(e) => updateManualContact(contact.id, 'addressCountryCode', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                          <option value="IN">IN - India</option>
                          <option value="US">US - United States</option>
                          <option value="GB">GB - United Kingdom</option>
                          <option value="CA">CA - Canada</option>
                          <option value="AU">AU - Australia</option>
                          <option value="DE">DE - Germany</option>
                          <option value="FR">FR - France</option>
                          <option value="JP">JP - Japan</option>
                          <option value="CN">CN - China</option>
                          <option value="BR">BR - Brazil</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Pincode</label>
                        <input
                          type="text"
                          value={contact.pincode}
                          onChange={(e) => updateManualContact(contact.id, 'pincode', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="Postal code"
                        />
                      </div>
                    </div>
                  </div>
                ))}

                {manualContacts.length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    <Users className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                    <p>No contacts added yet. Click "Add New Contact" to start.</p>
                  </div>
                )}
              </div>
            )}

            {/* Status Message */}
            {importStatus && (
              <div className={`p-4 rounded-lg mb-6 flex items-center space-x-3 ${
                importStatus.type === 'success' 
                  ? 'bg-green-50 border border-green-200 text-green-800' 
                  : 'bg-red-50 border border-red-200 text-red-800'
              }`}>
                {importStatus.type === 'success' ? (
                  <CheckCircle className="h-5 w-5" />
                ) : (
                  <AlertCircle className="h-5 w-5" />
                )}
                <span>{importStatus.message}</span>
              </div>
            )}

            {/* Combined Data Preview */}
            {(importedData.length > 0 || manualContacts.length > 0) && (
              <div className="bg-gray-50 rounded-xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <Users className="h-6 w-6 text-gray-600" />
                    <h3 className="text-lg font-semibold text-gray-800">
                      All Contacts ({importedData.length + manualContacts.length})
                    </h3>
                  </div>
                  <button
                    onClick={processContacts}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
                  >
                    Process All Contacts
                  </button>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-gray-200 bg-gray-100">
                        <th className="text-left p-3 font-medium text-gray-700">Source</th>
                        <th className="text-left p-3 font-medium text-gray-700">Name</th>
                        <th className="text-left p-3 font-medium text-gray-700">Gender</th>
                        <th className="text-left p-3 font-medium text-gray-700">Phone</th>
                        <th className="text-left p-3 font-medium text-gray-700">Country Code</th>
                        <th className="text-left p-3 font-medium text-gray-700">Email</th>
                        <th className="text-left p-3 font-medium text-gray-700">City</th>
                      </tr>
                    </thead>
                    <tbody>
                      {[...importedData.map(c => ({...c, source: 'Excel'})), ...manualContacts.map(c => ({...c, source: 'Manual'}))].slice(0, 10).map((contact, index) => (
                        <tr key={index} className="border-b border-gray-100 hover:bg-gray-50">
                          <td className="p-3">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                              contact.source === 'Excel' 
                                ? 'bg-blue-100 text-blue-800' 
                                : 'bg-purple-100 text-purple-800'
                            }`}>
                              {contact.source}
                            </span>
                          </td>
                          <td className="p-3 text-gray-800">{contact.fullName}</td>
                          <td className="p-3 text-gray-600">{contact.gender}</td>
                          <td className="p-3 text-gray-600">{contact.phoneNumber}</td>
                          <td className="p-3 text-gray-600">{contact.countryCode}</td>
                          <td className="p-3 text-gray-600">{contact.email}</td>
                          <td className="p-3 text-gray-600">{contact.city}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {(importedData.length + manualContacts.length) > 10 && (
                    <p className="text-center text-gray-500 mt-3">
                      ...and {(importedData.length + manualContacts.length) - 10} more contacts
                    </p>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExcelContactManager;