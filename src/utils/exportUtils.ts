import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as XLSX from 'xlsx';
import { LeaveApplication } from '../types';
import { formatDateString } from './dateUtils';

export const exportLeavesToPDF = (
  leaves: LeaveApplication[],
  title: string = 'KBN_College_Leave_Report',
  subtitle: string = 'KBN College Academic Records'
) => {
  const doc = new jsPDF('landscape', 'mm', 'a4');

  // Header Banner
  doc.setFillColor(15, 23, 42); // Navy Blue (#0f172a)
  doc.rect(0, 0, 297, 28, 'F');

  doc.setTextColor(255, 255, 255);
  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  doc.text("KBN COLLEGE - STUDENT LEAVE PORTAL", 14, 13);

  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(203, 213, 225);
  doc.text(`${subtitle} | Generated on: ${new Date().toLocaleDateString('en-US', { dateStyle: 'long' })}`, 14, 21);

  // Table Data Preparation
  const tableData = leaves.map((leave, index) => [
    index + 1,
    leave.studentName,
    leave.rollNumber,
    leave.branchName,
    `${leave.year} (${leave.semester}-${leave.section})`,
    leave.leaveType,
    `${formatDateString(leave.fromDate)} to ${formatDateString(leave.toDate)}`,
    leave.numberOfDays,
    leave.status === 'approved' ? 'APPROVED' :
    leave.status === 'rejected' ? 'REJECTED' :
    leave.status === 'pending_principal' ? 'Pending Principal' : 'Pending Counsellor',
    leave.counsellorStatus === 'approved' ? 'Approved' : leave.counsellorStatus === 'rejected' ? 'Rejected' : 'Pending',
    leave.principalStatus === 'approved' ? 'Approved' : leave.principalStatus === 'rejected' ? 'Rejected' : 'Pending'
  ]);

  autoTable(doc, {
    startY: 34,
    head: [[
      '#', 'Student Name', 'Roll No.', 'Branch', 'Year / Sem', 'Type', 'Duration', 'Days', 'Final Status', 'Counsellor', 'Principal'
    ]],
    body: tableData,
    theme: 'grid',
    headStyles: {
      fillColor: [79, 70, 229], // Indigo 600
      textColor: 255,
      fontSize: 9,
      fontStyle: 'bold',
      halign: 'center'
    },
    bodyStyles: {
      fontSize: 8.5,
      textColor: [30, 41, 59]
    },
    alternateRowStyles: {
      fillColor: [248, 250, 252]
    },
    margin: { top: 34, left: 14, right: 14 }
  });

  // Footer page numbers
  const pageCount = (doc as any).internal.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setTextColor(148, 163, 184);
    doc.text(`Page ${i} of ${pageCount} - Official KBN College Records`, 297 / 2, 202, { align: 'center' });
  }

  const filename = `${title.toLowerCase().replace(/[^a-z0-9]/g, '_')}_${Date.now()}.pdf`;
  doc.save(filename);
};

export const exportLeavesToExcel = (
  leaves: LeaveApplication[],
  filenamePrefix: string = 'kbn_college_leave_report'
) => {
  const excelData = leaves.map((leave, index) => ({
    'S.No': index + 1,
    'College': 'KBN College',
    'Student Name': leave.studentName,
    'Roll Number': leave.rollNumber,
    'Student ID': leave.studentCode,
    'Branch': leave.branchName,
    'Year': leave.year,
    'Semester': leave.semester,
    'Section': leave.section,
    'Leave Type': leave.leaveType,
    'From Date': leave.fromDate,
    'To Date': leave.toDate,
    'Number of Days': leave.numberOfDays,
    'Reason': leave.reason,
    'Ward Counsellor': leave.counsellorName || 'N/A',
    'Counsellor Status': leave.counsellorStatus || 'Pending',
    'Principal Status': leave.principalStatus || 'Pending',
    'Overall Status': leave.status,
    'Rejection Reason': leave.rejectionReason || 'N/A',
    'Application Date': formatDateString(leave.appliedDate)
  }));

  const worksheet = XLSX.utils.json_to_sheet(excelData);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'KBN Leave Records');

  const max_widths = Object.keys(excelData[0] || {}).map(key => ({
    wch: Math.max(key.length + 3, 15)
  }));
  worksheet['!cols'] = max_widths;

  const filename = `${filenamePrefix}_${Date.now()}.xlsx`;
  XLSX.writeFile(workbook, filename);
};
