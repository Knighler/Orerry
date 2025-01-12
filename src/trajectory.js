// Class to define a planet's orbital trajectory
export default class Trajectory {
    constructor(name, smA, oI, oE, aN, lP, mAe, Sidereal,islP=true) {
        const DEG2RAD = Math.PI / 180;
        this.name = name;
        this.smA = smA * 10;   // Semi-major axis in AU (Multiply by 10 inside the function for scale)
        this.oI = oI * DEG2RAD;   // Orbital inclination (degrees to radians)
        this.oE = oE;    // Orbital eccentricity
        if (islP) {
            this.aN = aN * DEG2RAD;   // Longitude of ascending node (degrees to radians)
            this.lP = lP * DEG2RAD; // Longitude of perihelion (degrees to radians)
            this.aP = this.lP - this.aN;   // Argument of perihelion (radians)
        } else {
            this.aN = aN * DEG2RAD;   // Longitude of ascending node (degrees to radians)
            this.aP = lP * DEG2RAD;  // Argument of perihelion (radians)
        }
        this.period = Sidereal / 365.256;    // Sidereal period (days to years)
        this.epochMeanAnomaly = mAe * DEG2RAD; // Mean anomaly at epoch (degrees to radians)
        this.trueAnomaly = 0;
        this.position = [0, 0, 0];
        this.time = 0;
    }

    propagate(uA) {
        const pos = [];
        const theta = uA;
        const smA = this.smA;
        const oI = this.oI;
        const aP = this.aP;
        const oE = this.oE;
        const aN = this.aN;

        const sLR = smA * (1 - oE ** 2);
        const r = sLR / (1 + oE * Math.cos(theta));

        pos[0] = r * (Math.cos(aP + theta) * Math.cos(aN) - Math.cos(oI) * Math.sin(aP + theta) * Math.sin(aN)); // X
        pos[1] = r * Math.sin(aP + theta) * Math.sin(oI); // Y
        pos[2] = r * (Math.cos(aP + theta) * Math.sin(aN) + Math.cos(oI) * Math.sin(aP + theta) * Math.cos(aN)); // Z

        return pos;
    }
}
