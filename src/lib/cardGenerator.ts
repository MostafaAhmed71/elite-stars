import { Student, SchoolConfig } from '@/types';

/**
 * Generates and downloads a luxury high-resolution recognition card as a PNG image
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

  // 1. Cinematic Cosmic Background Gradient
  const bgGrad = ctx.createLinearGradient(0, 0, width, height);
  bgGrad.addColorStop(0, '#081B38');
  bgGrad.addColorStop(0.3, '#061427');
  bgGrad.addColorStop(0.7, '#071830');
  bgGrad.addColorStop(1, '#040C1A');
  ctx.fillStyle = bgGrad;
  ctx.fillRect(0, 0, width, height);

  // 2. Cosmic Nebula Radial Glow
  const radialGlow = ctx.createRadialGradient(width / 2, 450, 80, width / 2, 450, 560);
  radialGlow.addColorStop(0, 'rgba(255, 216, 132, 0.32)');
  radialGlow.addColorStop(0.5, 'rgba(16, 45, 84, 0.45)');
  radialGlow.addColorStop(1, 'rgba(4, 12, 26, 0)');
  ctx.fillStyle = radialGlow;
  ctx.fillRect(0, 0, width, height);

  // 3. Starlight Particles
  for (let i = 0; i < 110; i++) {
    const sx = Math.sin(i * 123.45) * 0.5 + 0.5;
    const sy = Math.cos(i * 67.89) * 0.5 + 0.5;
    const px = sx * width;
    const py = sy * height;
    const radius = (i % 3 === 0) ? 2.5 : 1.2;
    ctx.fillStyle = (i % 4 === 0) ? '#FFE8A3' : '#E8F4FF';
    ctx.globalAlpha = 0.35 + (i % 5) * 0.15;
    ctx.beginPath();
    ctx.arc(px, py, radius, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.globalAlpha = 1.0;

  // 4. Double Luxury Gold Border with Ornate Corner Filigree
  const padding = 50;
  ctx.strokeStyle = '#EFC16C';
  ctx.lineWidth = 3.5;
  ctx.strokeRect(padding, padding, width - padding * 2, height - padding * 2);

  ctx.strokeStyle = '#FFD884';
  ctx.lineWidth = 1.5;
  ctx.strokeRect(padding + 12, padding + 12, width - (padding + 12) * 2, height - (padding + 12) * 2);

  // Corner decorative flourishes
  const cornerSize = 45;
  const corners = [
    [padding + 4, padding + 4, 1, 1],
    [width - padding - 4, padding + 4, -1, 1],
    [padding + 4, height - padding - 4, 1, -1],
    [width - padding - 4, height - padding - 4, -1, -1],
  ];

  ctx.strokeStyle = '#FFE8A3';
  ctx.lineWidth = 4.5;
  corners.forEach(([x, y, dx, dy]) => {
    ctx.beginPath();
    ctx.moveTo(x, y + dy * cornerSize);
    ctx.lineTo(x, y);
    ctx.lineTo(x + dx * cornerSize, y);
    ctx.stroke();

    // Corner diamond node
    ctx.fillStyle = '#FFD884';
    ctx.beginPath();
    ctx.arc(x + dx * 10, y + dy * 10, 3, 0, Math.PI * 2);
    ctx.fill();
  });

  // 5. Header: School Official Logo & Title
  try {
    const logoImg = await loadImage('/images/school-logo.jpg');
    ctx.save();
    ctx.fillStyle = '#FFFFFF';
    ctx.beginPath();
    ctx.arc(width / 2, 105, 42, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#FFD884';
    ctx.lineWidth = 3.5;
    ctx.stroke();
    ctx.clip();
    ctx.drawImage(logoImg, width / 2 - 42, 105 - 42, 84, 84);
    ctx.restore();
  } catch (e) {
    console.warn('Could not load school logo for canvas', e);
  }

  ctx.textAlign = 'center';
  ctx.direction = 'rtl';
  ctx.fillStyle = '#FFF8EA';
  ctx.font = 'bold 36px "Cairo", "IBM Plex Sans Arabic", sans-serif';
  ctx.fillText(school.name || 'مدارس نخبة الشمال الأهلية والعالمية', width / 2, 185);

  ctx.fillStyle = '#EFC16C';
  ctx.font = '20px "Cairo", "IBM Plex Sans Arabic", sans-serif';
  ctx.fillText(`لوحة الشرف الرسمية • ${school.slogan || 'تميز بالتعليم .. جودة في الأداء .. تنمية للمواهب'}`, width / 2, 222);

  // 6. Radiant Sunburst Rays & Portrait Bezel
  const portraitCenterX = width / 2;
  const portraitCenterY = 475;
  const portraitRadius = 165;

  // Radiating rays
  for (let a = 0; a < 32; a++) {
    const angle = (a * 2 * Math.PI) / 32;
    const r1 = portraitRadius + 20;
    const r2 = portraitRadius + 55;
    ctx.strokeStyle = (a % 2 === 0) ? 'rgba(255, 232, 163, 0.55)' : 'rgba(239, 193, 108, 0.28)';
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.moveTo(portraitCenterX + Math.cos(angle) * r1, portraitCenterY + Math.sin(angle) * r1);
    ctx.lineTo(portraitCenterX + Math.cos(angle) * r2, portraitCenterY + Math.sin(angle) * r2);
    ctx.stroke();
  }

  // Draw 5-pointed 3D faceted gold crown star at top
  draw3DStar(ctx, portraitCenterX, portraitCenterY - portraitRadius - 26, 32);

  // Load and draw student portrait inside circle
  try {
    const img = await loadImage(student.avatarUrl);
    ctx.save();
    ctx.beginPath();
    ctx.arc(portraitCenterX, portraitCenterY, portraitRadius, 0, Math.PI * 2);
    ctx.clip();
    ctx.drawImage(
      img,
      portraitCenterX - portraitRadius,
      portraitCenterY - portraitRadius,
      portraitRadius * 2,
      portraitRadius * 2
    );
    ctx.restore();
  } catch (e) {
    console.warn('Could not load student portrait for canvas, using fallback', e);
  }

  // Multi-tier golden frame ring over portrait
  ctx.strokeStyle = '#FFE8A3';
  ctx.lineWidth = 9;
  ctx.beginPath();
  ctx.arc(portraitCenterX, portraitCenterY, portraitRadius + 5, 0, Math.PI * 2);
  ctx.stroke();

  ctx.strokeStyle = '#C99632';
  ctx.lineWidth = 2.5;
  ctx.beginPath();
  ctx.arc(portraitCenterX, portraitCenterY, portraitRadius + 15, 0, Math.PI * 2);
  ctx.stroke();

  // 7. Sculpted Golden Ribbon «نجم الأسبوع» with 3D folded tails
  const ribbonY = portraitCenterY + portraitRadius - 18;
  const ribbonWidth = 440;
  const ribbonHeight = 76;

  // Ribbon Left Tail
  ctx.fillStyle = '#4A3408';
  ctx.beginPath();
  ctx.moveTo(portraitCenterX - ribbonWidth / 2 - 35, ribbonY + 16);
  ctx.lineTo(portraitCenterX - ribbonWidth / 2, ribbonY + 16);
  ctx.lineTo(portraitCenterX - ribbonWidth / 2, ribbonY + ribbonHeight + 12);
  ctx.lineTo(portraitCenterX - ribbonWidth / 2 - 35, ribbonY + ribbonHeight + 12);
  ctx.lineTo(portraitCenterX - ribbonWidth / 2 - 14, ribbonY + (ribbonHeight + 28) / 2);
  ctx.closePath();
  ctx.fill();

  // Ribbon Right Tail
  ctx.beginPath();
  ctx.moveTo(portraitCenterX + ribbonWidth / 2 + 35, ribbonY + 16);
  ctx.lineTo(portraitCenterX + ribbonWidth / 2, ribbonY + 16);
  ctx.lineTo(portraitCenterX + ribbonWidth / 2, ribbonY + ribbonHeight + 12);
  ctx.lineTo(portraitCenterX + ribbonWidth / 2 + 35, ribbonY + ribbonHeight + 12);
  ctx.lineTo(portraitCenterX + ribbonWidth / 2 + 14, ribbonY + (ribbonHeight + 28) / 2);
  ctx.closePath();
  ctx.fill();

  // Ribbon Center Banner Fill
  const ribbonGrad = ctx.createLinearGradient(portraitCenterX - ribbonWidth / 2, 0, portraitCenterX + ribbonWidth / 2, 0);
  ribbonGrad.addColorStop(0, '#A67C1E');
  ribbonGrad.addColorStop(0.15, '#D4AF37');
  ribbonGrad.addColorStop(0.35, '#FFE8A3');
  ribbonGrad.addColorStop(0.5, '#FFF9E6');
  ribbonGrad.addColorStop(0.65, '#FFE8A3');
  ribbonGrad.addColorStop(0.85, '#D4AF37');
  ribbonGrad.addColorStop(1, '#A67C1E');

  ctx.fillStyle = ribbonGrad;
  ctx.beginPath();
  ctx.roundRect(portraitCenterX - ribbonWidth / 2, ribbonY, ribbonWidth, ribbonHeight, 8);
  ctx.fill();

  ctx.strokeStyle = '#FFFFFF';
  ctx.lineWidth = 2;
  ctx.stroke();

  // Ribbon Text «نجم الأسبوع»
  ctx.fillStyle = '#061325';
  ctx.font = '900 42px "Cairo", "IBM Plex Sans Arabic", sans-serif';
  ctx.fillText('نجم الأسبوع', portraitCenterX, ribbonY + 53);

  // 8. Student Full Name
  ctx.fillStyle = '#FFE8A3';
  ctx.font = '900 58px "Cairo", "IBM Plex Sans Arabic", sans-serif';
  ctx.fillText(student.fullName, width / 2, 755);

  // Grade & Class Subtitle
  ctx.fillStyle = '#FFF8EA';
  ctx.font = 'bold 30px "Cairo", "IBM Plex Sans Arabic", sans-serif';
  ctx.fillText(`${student.gradeLevel} • الفصل ${student.className}`, width / 2, 810);

  // 9. Congratulatory Message Citation Box
  const boxX = 120;
  const boxY = 870;
  const boxWidth = width - 240;
  const boxHeight = 230;

  ctx.fillStyle = 'rgba(15, 45, 84, 0.65)';
  ctx.beginPath();
  ctx.roundRect(boxX, boxY, boxWidth, boxHeight, 24);
  ctx.fill();

  ctx.strokeStyle = 'rgba(255, 216, 132, 0.45)';
  ctx.lineWidth = 2;
  ctx.stroke();

  // Gold quotation mark
  ctx.fillStyle = '#FFD884';
  ctx.font = '60px serif';
  ctx.fillText('“', width / 2, boxY + 45);

  // Recognition Reason wrapped
  ctx.fillStyle = '#FFF8EA';
  ctx.font = 'bold 26px "Cairo", "IBM Plex Sans Arabic", sans-serif';
  wrapText(ctx, student.recognitionReason, width / 2, boxY + 100, boxWidth - 60, 44);

  // 10. Achievement Trait Medallions
  const badgeY = 1175;
  const badgeCount = student.badges.length;
  const colWidth = 260;
  const totalBadgesWidth = badgeCount * colWidth;
  let startX = (width - totalBadgesWidth) / 2;

  student.badges.forEach((badge) => {
    // Medallion outer ring
    ctx.strokeStyle = '#FFD884';
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.arc(startX + colWidth / 2, badgeY, 26, 0, Math.PI * 2);
    ctx.stroke();

    ctx.fillStyle = '#081B38';
    ctx.beginPath();
    ctx.arc(startX + colWidth / 2, badgeY, 24, 0, Math.PI * 2);
    ctx.fill();

    // Star icon inside medallion
    draw3DStar(ctx, startX + colWidth / 2, badgeY, 15);

    // Label
    ctx.fillStyle = '#FFF8EA';
    ctx.font = 'bold 24px "Cairo", "IBM Plex Sans Arabic", sans-serif';
    ctx.fillText(badge, startX + colWidth / 2, badgeY + 62);

    startX += colWidth;
  });

  // 11. Footer Watermark & Date
  ctx.fillStyle = 'rgba(239, 193, 108, 0.85)';
  ctx.font = '22px "Cairo", "IBM Plex Sans Arabic", sans-serif';
  ctx.fillText('ELITE STARS | نجوم الأسبوع — وسام الشرف والتميز المدرسي', width / 2, 1390);

  ctx.fillStyle = 'rgba(255, 248, 234, 0.6)';
  ctx.font = '18px "Cairo", "IBM Plex Sans Arabic", sans-serif';
  ctx.fillText(`العام الدراسي 1446هـ • تم الإصدار بتاريخ: ${new Date().toLocaleDateString('ar-SA')}`, width / 2, 1425);

  // Trigger download
  canvas.toBlob((blob) => {
    if (!blob) return;
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `وسام_نجم_الأسبوع_${student.fullName.replace(/\s+/g, '_')}.png`;
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
    ctx.fillStyle = '#FFF9E6';
    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.lineTo(points[i].x, points[i].y);
    ctx.lineTo(points[(i + 1) % 10].x, points[(i + 1) % 10].y);
    ctx.closePath();
    ctx.fill();

    ctx.fillStyle = '#C99632';
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
