const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");

const drawPath = (points) => {
    for (let p = 0; p < points.length - 1; p++) {
        drawPoint(points[p]);
        drawLine(points[p], points[p + 1]);
    }
    drawPoint(points[points.length-1]);
};

const drawPoint = (point) => {
    ctx.beginPath();
    const x = point.x * canvasScale;
    const y = point.y * canvasScale;
    const r = 2 * canvasScale;
    ctx.arc(x, y, r, 0, 2 * Math.PI);
    ctx.stroke();
};

const drawLine = (p1, p2) => {
    ctx.beginPath();
    const x1 = p1.x * canvasScale;
    const y1 = p1.y * canvasScale;
    const x2 = p2.x * canvasScale;
    const y2 = p2.y * canvasScale;
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.stroke();
};

const setLineColor = (color) => {
    ctx.strokeStyle = color;
}

const setFillColor = (color) => {
    ctx.fillStyle = color;
}


const setLineWeight = (weight) => {
    ctx.lineWidth = weight; 
}

const clearCanvas = () => {
    // ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "#fafafa";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
}