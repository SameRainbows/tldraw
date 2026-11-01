import { Box } from '@tldraw/editor'

/**
 * Adds a rounded rectangle path to an existing `Path2D` instance.
 *
 * @param path - The `Path2D` instance to append the rounded rectangle to.
 * @param box - The bounding box of the rounded rectangle.
 * @param radius - The corner radius.
 * @param counterClockwise - Whether to draw the path in counter-clockwise order. Defaults to `false`.
 * @public
 */
export function addRoundedRectPath(
	path: Path2D,
	box: Box,
	radius: number,
	counterClockwise = false
) {
	const r = Math.max(0, Math.min(radius, box.w / 2, box.h / 2))

	if (r === 0) {
		path.rect(box.x, box.y, box.w, box.h)
		return
	}

	if (counterClockwise) {
		path.moveTo(box.x, box.y + r)
		path.lineTo(box.x, box.maxY - r)
		path.arcTo(box.x, box.maxY, box.x + r, box.maxY, r)
		path.lineTo(box.maxX - r, box.maxY)
		path.arcTo(box.maxX, box.maxY, box.maxX, box.maxY - r, r)
		path.lineTo(box.maxX, box.y + r)
		path.arcTo(box.maxX, box.y, box.maxX - r, box.y, r)
		path.lineTo(box.x + r, box.y)
		path.arcTo(box.x, box.y, box.x, box.y + r, r)
		path.closePath()
		return
	}

	path.moveTo(box.x + r, box.y)
	path.lineTo(box.maxX - r, box.y)
	path.arcTo(box.maxX, box.y, box.maxX, box.y + r, r)
	path.lineTo(box.maxX, box.maxY - r)
	path.arcTo(box.maxX, box.maxY, box.maxX - r, box.maxY, r)
	path.lineTo(box.x + r, box.maxY)
	path.arcTo(box.x, box.maxY, box.x, box.maxY - r, r)
	path.lineTo(box.x, box.y + r)
	path.arcTo(box.x, box.y, box.x + r, box.y, r)
	path.closePath()
}
