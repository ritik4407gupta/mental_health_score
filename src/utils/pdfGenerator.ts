import { jsPDF } from 'jspdf';
import { StudentData } from '../types';

export function generateMentalHealthPDF(
  score: number, // 0 to 10 score
  data: StudentData,
  scoreLabel: string,
  recommendations: Array<{ title: string; text: string }>
) {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const pageWidth = doc.internal.pageSize.getWidth(); // ~210 mm
  const margin = 15;
  const contentWidth = pageWidth - margin * 2;
  let y = 18;

  // Background Header Accent Bar
  doc.setFillColor(15, 23, 42); // slate-900
  doc.rect(0, 0, pageWidth, 42, 'F');

  doc.setFillColor(16, 185, 129); // emerald-500 accent line
  doc.rect(0, 42, pageWidth, 2, 'F');

  // Title / Brand Name
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(22);
  doc.text('MindScore AI Report', margin, y + 4);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.setTextColor(148, 163, 184); // slate-400
  doc.text('Student Mental Health Machine Learning Assessment', margin, y + 11);

  // Date on the right
  const dateStr = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
  doc.setFontSize(9);
  doc.text(`Date: ${dateStr}`, pageWidth - margin, y + 4, { align: 'right' });
  doc.text('Model Version: ML v1.0', pageWidth - margin, y + 11, { align: 'right' });

  y = 52;

  // SCORE SUMMARY BANNER BOX
  const scoreBoxHeight = 36;
  doc.setFillColor(248, 250, 252); // slate-50
  doc.setDrawColor(226, 232, 240); // slate-200
  doc.roundedRect(margin, y, contentWidth, scoreBoxHeight, 3, 3, 'FD');

  // Big Score Text
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(32);
  const formattedScore = score.toFixed(1);
  
  if (score >= 8.0) {
    doc.setTextColor(16, 185, 129); // emerald
  } else if (score >= 6.5) {
    doc.setTextColor(13, 148, 136); // teal
  } else if (score >= 4.8) {
    doc.setTextColor(217, 119, 6); // amber
  } else {
    doc.setTextColor(225, 29, 72); // rose
  }

  doc.text(`${formattedScore}`, margin + 10, y + 22);

  doc.setFontSize(14);
  doc.setTextColor(100, 116, 139);
  doc.text('/ 10', margin + 38, y + 22);

  // Status Badge box
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(30, 41, 59);
  doc.text(`Status: ${scoreLabel}`, margin + 70, y + 16);

  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(100, 116, 139);
  doc.text('Evaluated across digital screen time, sleep, study, and stress parameters.', margin + 70, y + 24);

  y += scoreBoxHeight + 12;

  // SECTION 1: STUDENT PROFILE & HABITS SUMMARY TABLE
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(13);
  doc.setTextColor(15, 23, 42);
  doc.text('1. Student Parameters & Habits Breakdown', margin, y);
  y += 6;

  // Table header
  doc.setFillColor(241, 245, 249);
  doc.rect(margin, y, contentWidth, 8, 'F');
  doc.setFontSize(9);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(51, 65, 85);
  doc.text('PARAMETER', margin + 4, y + 5.5);
  doc.text('VALUE / METRIC', margin + 100, y + 5.5);
  y += 8;

  const rows = [
    ['Age & Gender', `${data.age} years old | ${data.gender}`],
    ['Country & Academic Level', `${data.country} | ${data.academic_level}`],
    ['Primary Social Platform', `${data.most_used_platform} (${data.purpose_of_use})`],
    ['Daily Social Screen Usage', `${data.avg_daily_usage_hours} hours / day`],
    ['Daily Phone Unlocks', `${data.daily_unlocks} unlocks / day`],
    ['Nightly Sleep Duration', `${data.sleep_hours_per_night} hours / night`],
    ['Daily Study Hours', `${data.study_hours} hours / day`],
    ['Physical Exercise', `${data.physical_activity_hours} hours / day`],
    ['Perceived Stress Level', `${data.stress_level} Stress`],
  ];

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);

  rows.forEach(([param, val], idx) => {
    if (idx % 2 === 1) {
      doc.setFillColor(248, 250, 252);
      doc.rect(margin, y, contentWidth, 7, 'F');
    }
    doc.setTextColor(51, 65, 85);
    doc.text(param, margin + 4, y + 5);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(15, 23, 42);
    doc.text(val, margin + 100, y + 5);
    doc.setFont('helvetica', 'normal');
    y += 7;
  });

  y += 8;

  // SECTION 2: PERSONALIZED ACTIONABLE RECOMMENDATIONS
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(13);
  doc.setTextColor(15, 23, 42);
  doc.text('2. AI-Generated Personalized Recommendations', margin, y);
  y += 8;

  recommendations.forEach((tip) => {
    doc.setFillColor(236, 253, 245); // light emerald tint
    doc.setDrawColor(167, 243, 208);
    doc.roundedRect(margin, y, contentWidth, 16, 2, 2, 'FD');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10);
    doc.setTextColor(6, 78, 59);
    doc.text(`• ${tip.title}`, margin + 5, y + 6);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8.5);
    doc.setTextColor(51, 65, 85);
    doc.text(tip.text, margin + 5, y + 12);

    y += 20;
  });

  y += 4;

  // FOOTER DISCLAIMER
  doc.setFontSize(8);
  doc.setTextColor(148, 163, 184);
  doc.text(
    'Disclaimer: This report is generated using an AI machine learning statistical model for wellness tracking.',
    margin,
    y
  );
  doc.text(
    'It is not a substitute for professional medical advice, diagnosis, or clinical mental health treatment.',
    margin,
    y + 4
  );

  // Save File
  doc.save(`MindScore_Mental_Health_Report_${formattedScore}_out_of_10.pdf`);
}
