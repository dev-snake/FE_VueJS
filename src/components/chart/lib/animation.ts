let width: number, height: number, gradient: { addColorStop: (arg0: number, arg1: string) => void; };
function getGradient(ctx: { createLinearGradient: (arg0: number, arg1: any, arg2: number, arg3: any) => { addColorStop: (arg0: number, arg1: string) => void; }; }, chartArea: { right: number; left: number; bottom: number; top: number; }) {
    const chartWidth = chartArea.right - chartArea.left;
    const chartHeight = chartArea.bottom - chartArea.top;
    if (!gradient || width !== chartWidth || height !== chartHeight) {
        // Create the gradient because this is either the first render
        // or the size of the chart has changed
        width = chartWidth;
        height = chartHeight;
        gradient = ctx.createLinearGradient(0, chartArea.bottom, 0, chartArea.top);
        gradient.addColorStop(0, '#F72C5B');
        gradient.addColorStop(0.5, 'yellow');
        gradient.addColorStop(1, '#50B498');
    }

    return gradient;
}
export default getGradient;