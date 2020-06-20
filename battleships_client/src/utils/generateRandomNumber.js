
// Function returns random number between 0 to X ( 9.99 mil )

export default function (x) {
    const randomID = Math.floor(Math.random() * (x + 1));
    return randomID;
}
