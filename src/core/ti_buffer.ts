export class ti_buffer {

	size: number;
	pushes: number;
	index: number;
	sum: number;
	vals: number[];

	constructor(size: number) {
		this.size = size;
		this.pushes = 0;
		this.index = 0;
		this.sum = 0;
		// this.vals = new Array(size)
		this.vals = []
	}

	static new(size: number): ti_buffer {
		return new ti_buffer(size);
	}

	// static free(buffer: ti_buffer): void {
	//     buffer = null
	// }

	push(val: number): void {
		if (this.pushes >= this.size) {
			this.sum -= this.vals[this.index];
		}

		this.sum += val;
		this.vals[this.index] = val;
		this.pushes += 1;
		this.index = (this.index + 1) % this.size;
	}

	qpush(val: number): void {
		this.vals[this.index] = val;
		this.index = (this.index + 1) % this.size;
	}

	get(val: number): number {
		return this.vals[(this.index + this.size - 1 + val) % this.size];
	}
}