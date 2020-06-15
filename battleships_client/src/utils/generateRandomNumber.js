
// Function returns random number between 0 to 9999999 ( 9.99 mil )

export default function () {
    const randomID = Math.floor(Math.random() * 10000000);
    return randomID;
}
