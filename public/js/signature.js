// Lightweight HTML5 Canvas Signature Pad
export class SignaturePad {
  constructor(canvasElement, onChange) {
    this.canvas = canvasElement;
    this.ctx = canvasElement.getContext('2d');
    this.onChange = onChange;
    this.isDrawing = false;
    this.hasDrawn = false;

    this.initCanvas();
    this.bindEvents();
  }

  initCanvas() {
    // Set high DPI canvas resolution
    const rect = this.canvas.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;
    this.canvas.width = (rect.width || 350) * dpr;
    this.canvas.height = (rect.height || 120) * dpr;
    this.ctx.scale(dpr, dpr);
    this.ctx.strokeStyle = '#0f172a';
    this.ctx.lineWidth = 2;
    this.ctx.lineCap = 'round';
    this.ctx.lineJoin = 'round';
  }

  bindEvents() {
    const getPos = (e) => {
      const rect = this.canvas.getBoundingClientRect();
      const clientX = e.touches ? e.touches[0].clientX : e.clientX;
      const clientY = e.touches ? e.touches[0].clientY : e.clientY;
      return {
        x: clientX - rect.left,
        y: clientY - rect.top
      };
    };

    const startDraw = (e) => {
      e.preventDefault();
      this.isDrawing = true;
      this.hasDrawn = true;
      const pos = getPos(e);
      this.ctx.beginPath();
      this.ctx.moveTo(pos.x, pos.y);
    };

    const draw = (e) => {
      if (!this.isDrawing) return;
      e.preventDefault();
      const pos = getPos(e);
      this.ctx.lineTo(pos.x, pos.y);
      this.ctx.stroke();
    };

    const stopDraw = (e) => {
      if (!this.isDrawing) return;
      this.isDrawing = false;
      if (this.onChange) {
        this.onChange(this.toDataURL());
      }
    };

    this.canvas.addEventListener('mousedown', startDraw);
    this.canvas.addEventListener('mousemove', draw);
    window.addEventListener('mouseup', stopDraw);

    this.canvas.addEventListener('touchstart', startDraw, { passive: false });
    this.canvas.addEventListener('touchmove', draw, { passive: false });
    window.addEventListener('touchend', stopDraw);
  }

  clear() {
    const dpr = window.devicePixelRatio || 1;
    this.ctx.clearRect(0, 0, this.canvas.width / dpr, this.canvas.height / dpr);
    this.hasDrawn = false;
    if (this.onChange) {
      this.onChange('');
    }
  }

  toDataURL() {
    if (!this.hasDrawn) return '';
    return this.canvas.toDataURL('image/png');
  }

  loadDataURL(dataUrl) {
    if (!dataUrl) {
      this.clear();
      return;
    }
    const img = new Image();
    img.onload = () => {
      const rect = this.canvas.getBoundingClientRect();
      this.clear();
      this.ctx.drawImage(img, 0, 0, rect.width || 350, rect.height || 120);
      this.hasDrawn = true;
    };
    img.src = dataUrl;
  }
}
