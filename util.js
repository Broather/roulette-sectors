const AR = {
    SU: 1,
    SPLIT: 2,
    STREET: 1.5,
    CORNER: 2,
}
class Sector {
    constructor(positions) {
        if (positions.includes(AR.STREET)) {
            console.assert(positions.filter(a => a == AR.STREET).length == 2, "ERROR: Sector must contain exactly 2 AR.STREETs")
        }
        // AR.CORNERs should also be 2 of them, but I can't check that because it has the same value as SPLIT
        this.positions = positions
        this.count = this.positions.length
    }
    get_limits(max_SU) {
        return {
            max: this.positions.map((a) => a * max_SU).reduce((a, b) => a + b),
            change_point: Math.min.apply(null, this.positions) * max_SU * this.count,
            min: this.count * 5
        }
    }
    get_bet(value, max_SU) {
        const limits = this.get_limits(max_SU)
        const max = limits.max
        const change_point = limits.change_point
        const min = limits.min

        let result = 0
        let step = min

        if (value >= max) {
            return Math.max.apply(null, this.positions) * max_SU
        } else if (value < min) {
            return 0
        } else if (value > change_point) {
            result = change_point / this.count
            value = value - change_point
            step = this.positions.filter(a => a != Math.min.apply(null, this.positions)).length * 5
        }

        return result + Math.floor(value / step) * 5
    }
    get_remainder(value, max_SU) {
        const limits = this.get_limits(max_SU)
        const max = limits.max
        const change_point = limits.change_point
        const min = limits.min

        let step = min

        if (value >= max) {
            return value - max
        } else if (value < min) {
            return value
        } else if (value > change_point) {
            value = value - change_point
            step = this.positions.filter(a => a != Math.min.apply(null, this.positions)).length * 5
        }

        return value % step
    }
}

export const tier = new Sector([AR.SPLIT, AR.SPLIT, AR.SPLIT, AR.SPLIT, AR.SPLIT, AR.SPLIT])
export const orpheline = new Sector([AR.SU, AR.SPLIT, AR.SPLIT, AR.SPLIT, AR.SPLIT])
export const vazon = new Sector([AR.STREET, AR.STREET, AR.SPLIT, AR.SPLIT, AR.SPLIT, AR.SPLIT, AR.CORNER, AR.CORNER, AR.SPLIT])
export const spiel = new Sector([AR.SPLIT, AR.SPLIT, AR.SU, AR.SPLIT])
