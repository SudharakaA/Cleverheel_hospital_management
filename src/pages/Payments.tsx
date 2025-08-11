
import React, { useState } from "react";
import AppLayout from "@/components/AppLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Search, DollarSign, Calendar, CreditCard } from "lucide-react";

// Mock payment data
const mockPayments = [
  {
    id: "PAY-001",
    patientName: "John Doe",
    doctorName: "Dr. Sarah Johnson",
    amount: 250.00,
    date: "2024-01-15",
    status: "Completed",
    method: "Credit Card",
    description: "Cardiology Consultation"
  },
  {
    id: "PAY-002",
    patientName: "Jane Smith",
    doctorName: "Dr. Michael Chen",
    amount: 180.00,
    date: "2024-01-14",
    status: "Pending",
    method: "Insurance",
    description: "Neurology Follow-up"
  },
  {
    id: "PAY-003",
    patientName: "Bob Johnson",
    doctorName: "Dr. Emily Rodriguez",
    amount: 120.00,
    date: "2024-01-13",
    status: "Completed",
    method: "Cash",
    description: "Pediatric Check-up"
  },
  {
    id: "PAY-004",
    patientName: "Alice Brown",
    doctorName: "Dr. David Wilson",
    amount: 300.00,
    date: "2024-01-12",
    status: "Failed",
    method: "Debit Card",
    description: "Orthopedic Surgery"
  },
  {
    id: "PAY-005",
    patientName: "Charlie Davis",
    doctorName: "Dr. Sarah Johnson",
    amount: 200.00,
    date: "2024-01-11",
    status: "Completed",
    method: "Credit Card",
    description: "Heart Screening"
  }
];

const Payments: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredPayments, setFilteredPayments] = useState(mockPayments);

  const handleSearch = () => {
    const filtered = mockPayments.filter(payment =>
      payment.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment.doctorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment.status.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment.method.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredPayments(filtered);
  };

  const handleClearSearch = () => {
    setSearchTerm("");
    setFilteredPayments(mockPayments);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Completed':
        return 'text-green-600 bg-green-100';
      case 'Pending':
        return 'text-yellow-600 bg-yellow-100';
      case 'Failed':
        return 'text-red-600 bg-red-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const totalAmount = filteredPayments.reduce((sum, payment) => sum + payment.amount, 0);

  return (
    <AppLayout
      topbar={
        <div className="flex justify-between items-center w-full">
          <h1 className="text-xl font-semibold">Payment Management</h1>
          <div className="text-sm text-muted-foreground">
            Total: ${totalAmount.toFixed(2)}
          </div>
        </div>
      }
    >
      <div className="space-y-6">
        {/* Search Section */}
        <Card>
          <CardHeader>
            <CardTitle>Search Payments</CardTitle>
            <CardDescription>
              Search by payment ID, patient name, doctor name, or status
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex gap-4">
              <div className="flex-1">
                <Input
                  placeholder="Search payments..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                />
              </div>
              <Button onClick={handleSearch}>
                <Search className="w-4 h-4 mr-2" />
                Search
              </Button>
              <Button variant="outline" onClick={handleClearSearch}>
                Clear
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <DollarSign className="w-8 h-8 text-green-600" />
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Amount</p>
                  <p className="text-2xl font-bold">${totalAmount.toFixed(2)}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <Calendar className="w-8 h-8 text-blue-600" />
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Payments</p>
                  <p className="text-2xl font-bold">{filteredPayments.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <CreditCard className="w-8 h-8 text-purple-600" />
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Completed</p>
                  <p className="text-2xl font-bold">
                    {filteredPayments.filter(p => p.status === 'Completed').length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <Search className="w-8 h-8 text-orange-600" />
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Pending</p>
                  <p className="text-2xl font-bold">
                    {filteredPayments.filter(p => p.status === 'Pending').length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Results Section */}
        <Card>
          <CardHeader>
            <CardTitle>Payment Records</CardTitle>
            <CardDescription>
              {filteredPayments.length === 0 ? "No payments found" : `${filteredPayments.length} payments found`}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {filteredPayments.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Payment ID</TableHead>
                    <TableHead>Patient</TableHead>
                    <TableHead>Doctor</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Method</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredPayments.map((payment) => (
                    <TableRow key={payment.id}>
                      <TableCell className="font-medium">
                        {payment.id}
                      </TableCell>
                      <TableCell>{payment.patientName}</TableCell>
                      <TableCell>{payment.doctorName}</TableCell>
                      <TableCell className="font-semibold">
                        ${payment.amount.toFixed(2)}
                      </TableCell>
                      <TableCell>{payment.date}</TableCell>
                      <TableCell>{payment.method}</TableCell>
                      <TableCell>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(payment.status)}`}>
                          {payment.status}
                        </span>
                      </TableCell>
                      <TableCell>{payment.description}</TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline">View</Button>
                          {payment.status === 'Pending' && (
                            <Button size="sm">Process</Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                No payments found matching your search criteria.
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
};

export default Payments;
