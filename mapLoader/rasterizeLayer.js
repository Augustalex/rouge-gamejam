const TILE_SIZE = 16;

export default function rasterizeLayer(tileLayer) {
    if (tileLayer.length === 0) throw Error('Need at least one row of tiles');

    let canvas = document.createElement('canvas');
    canvas.width = tileLayer.length * TILE_SIZE;
    canvas.height = tileLayer[0].length * TILE_SIZE;

    let context = canvas.getContext('2d');

    for (let y = 0; y < tileLayer.length; y++) {
        for (let x = 0; x < tileLayer[y].length; x++) {
            let tile = tileLayer[y][x];
            if (!tile) continue;

            context.drawImage(tile, 0, 0, tile.width, tile.height, x * tile.width, y * tile.height, tile.width, tile.height);
        }
    }

    return canvas;
}