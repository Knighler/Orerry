// elements:
// name, semi-major axis in AU, orbital inclination in degrees, orbital eccentricity
// long. of ascending node in degrees, long. of perihelion in degrees, mean anomaly at epoch J2000 in degrees, sidereal period in days

// before last parameter needs confirmation and a credible source

export const planetDataList = [
    {
        name: 'Mercury',
        elements: new Trajectory('Mercury', 0.387, 7.004, 0.2056, 48.33, 77.46, 174.796, 87.969),
        color: 0xaaaaaa
    },
    {
        name: 'Venus',
        elements: new Trajectory('Venus', 0.723, 3.395, 0.0068, 76.68069, 131.53298, 50.115, 224.701),
        color: 0xaaaaaa
    },
    {
        name: 'Earth',
        elements: new Trajectory('Earth', 1, 0, 0.01671022, -11.26064, 102.94719, 100.46435, 362.256),
        color: 0x00ff00
    },
    {
        name: 'Mars',
        elements: new Trajectory('Mars', 1.524, 1.848, 0.0935, 49.57854, 336.04084, 19.412, 686.980),
        color: 0xff0000
    },
    {
        name: 'Jupiter',
        elements: new Trajectory('Jupiter', 5.204, 1.304, 0.0487, 100.55615, 14.75385, 20.0209, 4332.589),
        color: 0xff0000
    },
    {
        name: 'Saturn',
        elements: new Trajectory('Saturn', 9.573, 2.486, 0.0520, 113.71504, 92.43194, 317.0205, 10759.22),
        color: 0xff0000
    },
    {
        name: 'Uranus',
        elements: new Trajectory('Uranus', 19.165, 0.770, 0.0469, 74.22988, 170.96424, 142.5903, 30685.4),
        color: 0xff0000
    },
    {
        name: 'Neptune',
        elements: new Trajectory('Neptune', 30.181, 1.770, 0.0097, 131.72, 44.97, 304.8801, 60189),
        color: 0xff0000
    }
];