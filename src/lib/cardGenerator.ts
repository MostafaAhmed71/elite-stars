import { Student, SchoolConfig } from '@/types';

/**
 * Generates and downloads the exact Royal Ivory & Navy Recognition Certificate as a high-resolution PNG image
 */
export async function generateStudentCardPNG(
  student: Student,
  school: SchoolConfig
): Promise<void> {
  const width = 1080;
  const height = 1520;

  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  // 1. Warm Ivory Radial Background
  const bgGrad = ctx.createRadialGradient(width / 2, height / 2, 100, width / 2, height / 2, width * 0.75);
  bgGrad.addColorStop(0, '#FFFFFF');
  bgGrad.addColorStop(0.7, '#FAF6EC');
  bgGrad.addColorStop(1, '#F3EBD8');
  ctx.fillStyle = bgGrad;
  ctx.fillRect(0, 0, width, height);

  // 2. Faint Islamic Pattern Watermark
  ctx.strokeStyle = 'rgba(12, 35, 64, 0.025)';
  ctx.lineWidth = 1;
  const step = 80;
  for (let x = 0; x < width; x += step) {
    for (let y = 0; y < height; y += step) {
      ctx.strokeRect(x, y, step, step);
      ctx.beginPath();
      ctx.moveTo(x + step / 2, y);
      ctx.lineTo(x + step, y + step / 2);
      ctx.lineTo(x + step / 2, y + step);
      ctx.lineTo(x, y + step / 2);
      ctx.closePath();
      ctx.stroke();
    }
  }

  // 3. Double Gold Certificate Border
  const pad = 36;
  ctx.strokeStyle = '#D4A853';
  ctx.lineWidth = 4;
  ctx.strokeRect(pad, pad, width - pad * 2, height - pad * 2);

  ctx.strokeStyle = 'rgba(212, 168, 83, 0.45)';
  ctx.lineWidth = 1.5;
  ctx.strokeRect(pad + 10, pad + 10, width - (pad + 10) * 2, height - (pad + 10) * 2);

  // Corner Diamond Accents
  const diamondCorners = [
    [pad + 18, pad + 18],
    [width - pad - 18, pad + 18],
    [pad + 18, height - pad - 18],
    [width - pad - 18, height - pad - 18],
  ];
  ctx.fillStyle = '#D4A853';
  diamondCorners.forEach(([cx, cy]) => {
    ctx.save();
    ctx.translate(cx, cy);
    ctx.rotate(Math.PI / 4);
    ctx.fillRect(-4, -4, 8, 8);
    ctx.restore();
  });

  // 4. Top-Left Navy & Gold Curved Corner Flourish
  ctx.save();
  ctx.fillStyle = '#0C2340';
  ctx.beginPath();
  ctx.moveTo(pad, pad);
  ctx.lineTo(pad, pad + 190);
  ctx.bezierCurveTo(pad + 80, pad + 170, pad + 160, pad + 110, pad + 195, pad);
  ctx.closePath();
  ctx.fill();

  ctx.strokeStyle = '#D4A853';
  ctx.lineWidth = 6;
  ctx.beginPath();
  ctx.moveTo(pad, pad + 205);
  ctx.bezierCurveTo(pad + 90, pad + 185, pad + 175, pad + 120, pad + 215, pad);
  ctx.stroke();

  ctx.strokeStyle = '#E5C37A';
  ctx.lineWidth = 2.5;
  ctx.beginPath();
  ctx.moveTo(pad, pad + 218);
  ctx.bezierCurveTo(pad + 100, pad + 195, pad + 185, pad + 130, pad + 228, pad);
  ctx.stroke();
  ctx.restore();

  // 5. Bottom-Right Navy & Gold Curved Corner Flourish (Mirrored)
  ctx.save();
  ctx.translate(width, height);
  ctx.rotate(Math.PI);
  ctx.fillStyle = '#0C2340';
  ctx.beginPath();
  ctx.moveTo(pad, pad);
  ctx.lineTo(pad, pad + 190);
  ctx.bezierCurveTo(pad + 80, pad + 170, pad + 160, pad + 110, pad + 195, pad);
  ctx.closePath();
  ctx.fill();

  ctx.strokeStyle = '#D4A853';
  ctx.lineWidth = 6;
  ctx.beginPath();
  ctx.moveTo(pad, pad + 205);
  ctx.bezierCurveTo(pad + 90, pad + 185, pad + 175, pad + 120, pad + 215, pad);
  ctx.stroke();
  ctx.restore();

  // 6. Top-Right Navy Bookmark Ribbon with Gold Star
  ctx.save();
  const rbX = width - pad - 120;
  const rbY = pad;
  const rbW = 60;
  const rbH = 120;
  ctx.fillStyle = '#0C2340';
  ctx.beginPath();
  ctx.moveTo(rbX, rbY);
  ctx.lineTo(rbX + rbW, rbY);
  ctx.lineTo(rbX + rbW, rbY + rbH);
  ctx.lineTo(rbX + rbW / 2, rbY + rbH - 25);
  ctx.lineTo(rbX, rbY + rbH);
  ctx.closePath();
  ctx.fill();
  ctx.strokeStyle = '#D4A853';
  ctx.lineWidth = 3;
  ctx.stroke();
  draw3DStar(ctx, rbX + rbW / 2, rbY + 50, 16);
  ctx.restore();

  // 7. Official School Logo & Bilingual Names
  const logoCenterY = 120;
  try {
    const logoImg = await loadImage('/images/school-logo.jpg');
    const logoW = 110;
    const logoH = 110;
    ctx.drawImage(logoImg, width / 2 - logoW / 2, logoCenterY - logoH / 2, logoW, logoH);
  } catch (e) {
    console.warn('Could not load logo for canvas:', e);
  }

  ctx.textAlign = 'center';
  ctx.direction = 'rtl';
  ctx.fillStyle = '#0C2340';
  ctx.font = '900 32px "Tajawal", "Cairo", sans-serif';
  ctx.fillText(school.name || 'مدارس نخبة الشمال الأهلية والعالمية بمحافظة رفحاء', width / 2, logoCenterY + 85);

  ctx.fillStyle = '#1E5162';
  ctx.font = 'bold 20px "Tajawal", "Cairo", sans-serif';
  ctx.fillText('Northern Elite Private and International Schools in Rafha', width / 2, logoCenterY + 118);

  // 8. Title Section: Star, Laurel Sprigs, and «نجم الأسبوع»
  const titleY = 320;
  draw3DStar(ctx, width / 2, titleY - 45, 18);

  // Title Text
  ctx.fillStyle = '#0C2340';
  ctx.font = '900 68px "Tajawal", "Cairo", sans-serif';
  ctx.fillText('نجم الأسبوع', width / 2, titleY + 20);

  // 3 small stars under title
  draw3DStar(ctx, width / 2 - 28, titleY + 45, 7);
  draw3DStar(ctx, width / 2, titleY + 45, 10);
  draw3DStar(ctx, width / 2 + 28, titleY + 45, 7);

  // 9. Student Portrait with Golden Laurel Wreath
  const portraitX = width / 2;
  const portraitY = 575;
  const portraitRadius = 145;

  // Draw Laurel Wreath leaves around portrait
  ctx.fillStyle = '#D4A853';
  for (let i = -7; i <= 7; i++) {
    if (Math.abs(i) < 2) continue;
    const angleLeft = Math.PI - (i * 0.16);
    const lx = portraitX + Math.cos(angleLeft) * (portraitRadius + 30);
    const ly = portraitY + Math.sin(angleLeft) * (portraitRadius + 30);
    ctx.save();
    ctx.translate(lx, ly);
    ctx.rotate(angleLeft + Math.PI / 4);
    ctx.beginPath();
    ctx.ellipse(0, 0, 16, 8, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    const angleRight = (i * 0.16);
    const rx = portraitX + Math.cos(angleRight) * (portraitRadius + 30);
    const ry = portraitY + Math.sin(angleRight) * (portraitRadius + 30);
    ctx.save();
    ctx.translate(rx, ry);
    ctx.rotate(angleRight - Math.PI / 4);
    ctx.beginPath();
    ctx.ellipse(0, 0, 16, 8, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }

  // Square Portrait with Gold Frame
  const squareSize = portraitRadius * 2;
  const squareX = portraitX - portraitRadius;
  const squareY = portraitY - portraitRadius;
  const cornerRadius = 24;

  try {
    const studentImg = await loadImage(student.avatarUrl || '/images/students/omar-ahmed.jpg');
    ctx.save();
    ctx.beginPath();
    ctx.roundRect(squareX, squareY, squareSize, squareSize, cornerRadius);
    ctx.clip();
    ctx.drawImage(studentImg, squareX, squareY, squareSize, squareSize);
    ctx.restore();
  } catch (e) {
    console.warn('Could not load student photo:', e);
  }

  // Multi-tier Polished Gold Square Frame
  ctx.strokeStyle = '#D4A853';
  ctx.lineWidth = 8;
  ctx.beginPath();
  ctx.roundRect(squareX - 2, squareY - 2, squareSize + 4, squareSize + 4, cornerRadius + 2);
  ctx.stroke();

  ctx.strokeStyle = '#F3E5AB';
  ctx.lineWidth = 2.5;
  ctx.beginPath();
  ctx.roundRect(squareX - 8, squareY - 8, squareSize + 16, squareSize + 16, cornerRadius + 6);
  ctx.stroke();

  // Bottom Royal Navy Ribbon with Gold Star
  const rbTailW = 340;
  const rbTailH = 48;
  const rbTailY = portraitY + portraitRadius - 16;
  ctx.fillStyle = '#0C2340';
  ctx.beginPath();
  ctx.roundRect(portraitX - rbTailW / 2, rbTailY, rbTailW, rbTailH, 12);
  ctx.fill();
  ctx.strokeStyle = '#D4A853';
  ctx.lineWidth = 3;
  ctx.stroke();
  draw3DStar(ctx, portraitX, rbTailY + rbTailH / 2, 22);

  // 10. Student Name & Grade Cartouche Plaque
  const plaqueY = 820;
  const plaqueW = 540;
  const plaqueH = 135;
  ctx.fillStyle = '#FFFFFF';
  ctx.beginPath();
  ctx.roundRect(portraitX - plaqueW / 2, plaqueY, plaqueW, plaqueH, 20);
  ctx.fill();

  ctx.strokeStyle = '#D4A853';
  ctx.lineWidth = 3;
  ctx.stroke();

  // Plaque Corner Accent Brackets
  ctx.strokeStyle = '#0C2340';
  ctx.lineWidth = 3;
  const bSize = 14;
  [
    [portraitX - plaqueW / 2 + 6, plaqueY + 6, 1, 1],
    [portraitX + plaqueW / 2 - 6, plaqueY + 6, -1, 1],
    [portraitX - plaqueW / 2 + 6, plaqueY + plaqueH - 6, 1, -1],
    [portraitX + plaqueW / 2 - 6, plaqueY + plaqueH - 6, -1, -1],
  ].forEach(([bx, by, dx, dy]) => {
    ctx.beginPath();
    ctx.moveTo(bx, by + dy * bSize);
    ctx.lineTo(bx, by);
    ctx.lineTo(bx + dx * bSize, by);
    ctx.stroke();
  });

  // Full Name
  ctx.fillStyle = '#0C2340';
  ctx.font = '900 48px "Tajawal", "Cairo", sans-serif';
  ctx.fillText(student.fullName, width / 2, plaqueY + 62);

  // Divider Line with Diamond
  ctx.strokeStyle = '#D4A853';
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(width / 2 - 90, plaqueY + 80);
  ctx.lineTo(width / 2 + 90, plaqueY + 80);
  ctx.stroke();

  // Grade & Class
  ctx.fillStyle = '#0C2340';
  ctx.font = 'bold 26px "Tajawal", "Cairo", sans-serif';
  ctx.fillText(`${student.gradeLevel} / ${student.className.split('/')[1] || student.className}`, width / 2, plaqueY + 115);

  // 11. Pointed Achievement Ribbon (شريط التكريم)
  const achY = 990;
  const achW = 420;
  const achH = 54;
  ctx.fillStyle = '#0C2340';
  ctx.beginPath();
  ctx.roundRect(width / 2 - achW / 2, achY, achW, achH, 14);
  ctx.fill();
  ctx.strokeStyle = '#D4A853';
  ctx.lineWidth = 2.5;
  ctx.stroke();

  ctx.fillStyle = '#FFF7E6';
  ctx.font = '900 28px "Tajawal", "Cairo", sans-serif';
  ctx.fillText(`🎓 ${student.category || student.badges?.[0] || 'التميز الأكاديمي'} 🎓`, width / 2, achY + 38);

  // 12. Congratulatory Message Box
  const msgY = 1075;
  const msgW = 760;
  const msgH = 135;
  ctx.fillStyle = '#FFFFFF';
  ctx.beginPath();
  ctx.roundRect(width / 2 - msgW / 2, msgY, msgW, msgH, 20);
  ctx.fill();
  ctx.strokeStyle = 'rgba(212, 168, 83, 0.7)';
  ctx.lineWidth = 2;
  ctx.stroke();

  ctx.fillStyle = '#0C2340';
  ctx.font = '900 30px "Tajawal", "Cairo", sans-serif';
  ctx.fillText('مبروك يا بطل..', width / 2, msgY + 45);

  ctx.fillStyle = '#173331';
  ctx.font = 'bold 24px "Tajawal", "Cairo", sans-serif';
  wrapText(ctx, student.recognitionReason || 'التفوق في مادة الرياضيات والحلول الذكية في المسابقات.', width / 2, msgY + 88, msgW - 60, 36);

  // 13. The 4 Honor Badges (قدوة حسنة، مبادرة، سلوك مميز، الانضباط)
  const bRowY = 1245;
  const bLabels = ['قدوة حسنة', 'مبادرة', 'سلوك مميز', 'الانضباط'];
  const bW = 175;
  const bH = 135;
  const bGap = 20;
  const totalBW = 4 * bW + 3 * bGap;
  const bStartX = (width - totalBW) / 2;

  bLabels.forEach((label, idx) => {
    const curX = bStartX + idx * (bW + bGap);
    // Card
    ctx.fillStyle = '#FFFFFF';
    ctx.beginPath();
    ctx.roundRect(curX, bRowY, bW, bH, 20);
    ctx.fill();
    ctx.strokeStyle = 'rgba(212, 168, 83, 0.7)';
    ctx.lineWidth = 2;
    ctx.stroke();

    // Circle Icon Badge
    ctx.fillStyle = '#0C2340';
    ctx.beginPath();
    ctx.arc(curX + bW / 2, bRowY + 45, 26, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#D4A853';
    ctx.lineWidth = 2;
    ctx.stroke();

    draw3DStar(ctx, curX + bW / 2, bRowY + 45, 14);

    // Label
    ctx.fillStyle = '#0C2340';
    ctx.font = '900 22px "Tajawal", "Cairo", sans-serif';
    ctx.fillText(label, curX + bW / 2, bRowY + 110);
  });

  // 14. Official Endorsement & Signatures
  const sigLineY = 1375;
  ctx.strokeStyle = 'rgba(212, 168, 83, 0.45)';
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(120, sigLineY);
  ctx.lineTo(width - 120, sigLineY);
  ctx.stroke();

  // Right Signatory: رائد النشاط (أ. طه شوقي)
  ctx.textAlign = 'center';
  ctx.direction = 'rtl';
  ctx.fillStyle = '#8B6E32';
  ctx.font = 'bold 20px "Tajawal", "Cairo", sans-serif';
  ctx.fillText('رائد النشاط', 240, sigLineY + 35);
  ctx.fillStyle = '#0C2340';
  ctx.font = '900 25px "Tajawal", "Cairo", sans-serif';
  ctx.fillText('أ. طه شوقي', 240, sigLineY + 68);

  // Center Seal
  ctx.save();
  ctx.beginPath();
  ctx.arc(width / 2, sigLineY + 45, 26, 0, Math.PI * 2);
  ctx.fillStyle = '#FAF6EC';
  ctx.fill();
  ctx.strokeStyle = '#D4A853';
  ctx.lineWidth = 2.5;
  ctx.stroke();
  draw3DStar(ctx, width / 2, sigLineY + 45, 14);
  ctx.restore();

  // Left Signatory: المدير التنفيذي (أ. عيد بن قيران العنزي)
  ctx.fillStyle = '#8B6E32';
  ctx.font = 'bold 20px "Tajawal", "Cairo", sans-serif';
  ctx.fillText('المدير التنفيذي', width - 240, sigLineY + 35);
  ctx.fillStyle = '#0C2340';
  ctx.font = '900 25px "Tajawal", "Cairo", sans-serif';
  ctx.fillText('أ. عيد بن قيران العنزي', width - 240, sigLineY + 68);

  // 15. Footer Copyright & Academic Year
  ctx.fillStyle = '#1E5162';
  ctx.font = 'bold 18px "Tajawal", "Cairo", sans-serif';
  ctx.fillText('مدارس نخبة الشمال الأهلية والعالمية • العام الدراسي 1448هـ', width / 2, 1475);

  // Trigger download
  canvas.toBlob((blob) => {
    if (!blob) return;
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `بطاقة_نجم_الأسبوع_${student.fullName.replace(/\s+/g, '_')}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }, 'image/png');
}

// 3D Faceted Star
function draw3DStar(
  ctx: CanvasRenderingContext2D,
  cx: number,
  cy: number,
  r: number
) {
  const innerR = r * 0.42;
  const points: { x: number; y: number }[] = [];

  for (let i = 0; i < 10; i++) {
    const angle = (i * Math.PI) / 5 - Math.PI / 2;
    const currentR = i % 2 === 0 ? r : innerR;
    points.push({
      x: cx + Math.cos(angle) * currentR,
      y: cy + Math.sin(angle) * currentR,
    });
  }

  // Draw light and dark facets
  for (let i = 0; i < 10; i += 2) {
    ctx.fillStyle = '#F3E5AB';
    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.lineTo(points[i].x, points[i].y);
    ctx.lineTo(points[(i + 1) % 10].x, points[(i + 1) % 10].y);
    ctx.closePath();
    ctx.fill();

    ctx.fillStyle = '#C59B27';
    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.lineTo(points[(i + 1) % 10].x, points[(i + 1) % 10].y);
    ctx.lineTo(points[(i + 2) % 10].x, points[(i + 2) % 10].y);
    ctx.closePath();
    ctx.fill();
  }
}

// Helper to load image
function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new window.Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
}

// Helper to wrap Arabic text on canvas
function wrapText(
  ctx: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number,
  maxWidth: number,
  lineHeight: number
) {
  const words = text.split(' ');
  let line = '';

  for (let n = 0; n < words.length; n++) {
    const testLine = line + words[n] + ' ';
    const metrics = ctx.measureText(testLine);
    const testWidth = metrics.width;
    if (testWidth > maxWidth && n > 0) {
      ctx.fillText(line.trim(), x, y);
      line = words[n] + ' ';
      y += lineHeight;
    } else {
      line = testLine;
    }
  }
  ctx.fillText(line.trim(), x, y);
}
