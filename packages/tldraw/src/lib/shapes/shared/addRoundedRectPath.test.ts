import { Box } from '@tldraw/editor'
import { addRoundedRectPath } from './addRoundedRectPath'

interface RecordedCommand {
	name: string
	args: number[]
}

class MockPath2D {
	commands: RecordedCommand[] = []

	rect(x: number, y: number, w: number, h: number) {
		this.commands.push({ name: 'rect', args: [x, y, w, h] })
	}

	moveTo(x: number, y: number) {
		this.commands.push({ name: 'moveTo', args: [x, y] })
	}

	lineTo(x: number, y: number) {
		this.commands.push({ name: 'lineTo', args: [x, y] })
	}

	arcTo(x1: number, y1: number, x2: number, y2: number, radius: number) {
		this.commands.push({ name: 'arcTo', args: [x1, y1, x2, y2, radius] })
	}

	closePath() {
		this.commands.push({ name: 'closePath', args: [] })
	}
}

describe('addRoundedRectPath', () => {
	it('falls back to rect when radius is zero', () => {
		const mock = new MockPath2D()
		const box = new Box(10, 20, 100, 80)

		addRoundedRectPath(mock as unknown as Path2D, box, 0)

		expect(mock.commands).toEqual([{ name: 'rect', args: [10, 20, 100, 80] }])
	})

	it('falls back to rect when radius is negative', () => {
		const mock = new MockPath2D()
		const box = new Box(10, 20, 100, 80)

		addRoundedRectPath(mock as unknown as Path2D, box, -5)

		expect(mock.commands).toEqual([{ name: 'rect', args: [10, 20, 100, 80] }])
	})

	it('draws clockwise rounded rect by default', () => {
		const mock = new MockPath2D()
		const box = new Box(10, 20, 100, 80)
		const radius = 10

		addRoundedRectPath(mock as unknown as Path2D, box, radius)

		expect(mock.commands).toEqual([
			{ name: 'moveTo', args: [20, 20] },
			{ name: 'lineTo', args: [100, 20] },
			{ name: 'arcTo', args: [110, 20, 110, 30, 10] },
			{ name: 'lineTo', args: [110, 90] },
			{ name: 'arcTo', args: [110, 100, 100, 100, 10] },
			{ name: 'lineTo', args: [20, 100] },
			{ name: 'arcTo', args: [10, 100, 10, 90, 10] },
			{ name: 'lineTo', args: [10, 30] },
			{ name: 'arcTo', args: [10, 20, 20, 20, 10] },
			{ name: 'closePath', args: [] },
		])
	})

	it('draws counter-clockwise rounded rect when counterClockwise is true', () => {
		const mock = new MockPath2D()
		const box = new Box(10, 20, 100, 80)
		const radius = 10

		addRoundedRectPath(mock as unknown as Path2D, box, radius, true)

		expect(mock.commands).toEqual([
			{ name: 'moveTo', args: [10, 30] },
			{ name: 'lineTo', args: [10, 90] },
			{ name: 'arcTo', args: [10, 100, 20, 100, 10] },
			{ name: 'lineTo', args: [100, 100] },
			{ name: 'arcTo', args: [110, 100, 110, 90, 10] },
			{ name: 'lineTo', args: [110, 30] },
			{ name: 'arcTo', args: [110, 20, 100, 20, 10] },
			{ name: 'lineTo', args: [20, 20] },
			{ name: 'arcTo', args: [10, 20, 10, 30, 10] },
			{ name: 'closePath', args: [] },
		])
	})

	it('clamps radius to half of width or height', () => {
		const mock = new MockPath2D()
		const box = new Box(0, 0, 100, 40)
		// radius 50 exceeds half height (20), so clamped to 20
		addRoundedRectPath(mock as unknown as Path2D, box, 50)

		expect(mock.commands).toEqual([
			{ name: 'moveTo', args: [20, 0] },
			{ name: 'lineTo', args: [80, 0] },
			{ name: 'arcTo', args: [100, 0, 100, 20, 20] },
			{ name: 'lineTo', args: [100, 20] },
			{ name: 'arcTo', args: [100, 40, 80, 40, 20] },
			{ name: 'lineTo', args: [20, 40] },
			{ name: 'arcTo', args: [0, 40, 0, 20, 20] },
			{ name: 'lineTo', args: [0, 20] },
			{ name: 'arcTo', args: [0, 0, 20, 0, 20] },
			{ name: 'closePath', args: [] },
		])
	})
})
