
export default function (coordinate) {
    const [x, y] = coordinate;
    if (x >= 0 && y >= 0) {
        if (x < 10 && y < 10) {
            return true;
        }
    }

    return false;
}
