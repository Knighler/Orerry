export const audioData = [
    // SUN
    {
        audioClips: [
            {
                file: new URL("../assets/audio/narrator/sun/sunintro.wav", import.meta.url).href, // Correct path construction
                subtitles: [
                    { text: "Igniting the world anew with such brilliance, the sun rose with casual elegance.", start: 0, end: 5 },
                    { text: "Whether it is a star or a floating fireball, it remains the heart and soul of the solar system.", start: 5, end: 11 },
                ]
            },
            {
                file: new URL("../assets/audio/narrator/sun/sunfact1.wav", import.meta.url).href,
                subtitles: [
                    { text: "The Sun is so big that about 1.3 million Earths could fit inside it and it weighs about 500 times more than all the planets and asteroids combined.", start: 0, end: 9 }
                ]
            },
            {
                file: new URL("../assets/audio/narrator/sun/sunfact2.wav", import.meta.url).href,
                subtitles: [
                    { text: "Did you know the sun is roughly 4.57 billion years old in Earth years? ", start: 0, end: 6 },
                    { text: "yet it's only about 20.5 years old in galactic years, reflecting its orbit around the galaxy.", start: 6, end: 12 }

                ]
            },
            {
                file: new URL("../assets/audio/narrator/sun/sunfact3.wav", import.meta.url).href,
                subtitles: [
                    { text: "It's funny to think we measure the sun's age in Earth years when the Earth didn't even exist when the sun was born.", start: 0, end: 6 }
                ]
            },
            {
                file: new URL("../assets/audio/narrator/sun/welcome.wav", import.meta.url).href, // Correct path construction
                subtitles: [
                    { text: "Welcome to the solar system.", start: 0, end: 2 },
                ]
            },
        ]
    },
    // MERCURY
    {
        audioClips: [
            {
                file: new URL("../assets/audio/narrator/mercury/mercuryintro.wav", import.meta.url).href, // Correct path construction
                subtitles: [
                    { text: "The wild child of the solar system. It's fast, fiery, and fearless, racing around the Sun like it's on turbo mode.", start: 0, end: 7 },
                    { text: "With extreme temps and cratered chaos, Mercury's the bold little planet that never hits the brakes.", start: 7, end: 14 }
                ]
            },
            {
                file: new URL("../assets/audio/narrator/mercury/mercuryfact1.wav", import.meta.url).href,
                subtitles: [
                    { text: "Thirteen times a century Mercury can be observed from the Earth passing across the face of the Sun in an event called a transit.", start: 0, end: 8 }
                ]
            },
            {
                file: new URL("../assets/audio/narrator/mercury/mercuryfact2.wav", import.meta.url).href,
                subtitles: [
                    { text: "Perceived as the hottest planet because it's closest to the Sun, Mercury is actually not the hottest.", start: 0, end: 6 },
                    { text: "That title goes to Venus, which is hotter due to its thick atmosphere.", start: 6, end: 11 }
                ]
            },
            {
                file: new URL("../assets/audio/narrator/mercury/mercuryfact3.wav", import.meta.url).href,
                subtitles: [
                    { text: "Mercury has wrinkles! As its iron core cooled, it formed lobate scarps.", start: 0, end: 7 },
                    { text: "Looks like even planets can't escape the effects of time.", start: 7, end: 10 }

                ]
            }
        ]
    },
    // VENUS
    {
        audioClips: [
            {
                file: new URL("../assets/audio/narrator/venus/venusintro.wav", import.meta.url).href,
                subtitles: [
                    { text: "The drama queen of the solar system! With crushing pressure, scorching heat, and toxic clouds, it spins backward because why not?", start: 0, end: 8 },
                    { text: "Fierce, fiery, and totally unpredictable, Venus loves to keep things intense.", start: 8, end: 13 },
                ]
            },
            {
                file: new URL("../assets/audio/narrator/venus/venusfact1.wav", import.meta.url).href,
                subtitles: [
                    { text: "Venus has been observed for thousands of years as it is the second brightest object in the night sky.", start: 0, end: 6 }
                ]
            },
            {
                file: new URL("../assets/audio/narrator/venus/venusfact2.wav", import.meta.url).href,
                subtitles: [
                    { text: "The clouds of Venus contain sulfuric acid, but the high temperatures mean the rain evaporates before it reaches the surface.", start: 0, end: 7 }
                ]
            },
            {
                file: new URL("../assets/audio/narrator/venus/venusfact3.wav", import.meta.url).href,
                subtitles: [
                    { text: "Venus has a 'day' that is longer than its 'year,' making it a unique case in the solar system.", start: 0, end: 5 }
                ]
            },
            {
                file: new URL("../assets/audio/narrator/venus/venusfact4.wav", import.meta.url).href,
                subtitles: [
                    { text: "Venus rotates on its axis in the opposite direction to most planets, meaning the Sun rises in the west and sets in the east.", start: 0, end: 7 }
                ]
            },
            {
                file: new URL("../assets/audio/narrator/venus/venusfact5.wav", import.meta.url).href,
                subtitles: [
                    { text: "Venus, known as the Morning Star and Evening Star, was once thought to be two different bodies by early civilizations.", start: 0, end: 7 },
                    { text: "Its orbit around the Sun causes it to shift visibility from after sunset to before sunrise as it overtakes Earth.", start: 7, end: 14 }
                ]
            },
            {
                file: new URL("../assets/audio/narrator/venus/venusfact6.wav", import.meta.url).href,
                subtitles: [
                    { text: "Venus is often called Earth's twin due to its similar size and composition, but its conditions are vastly different.", start: 0, end: 7 }
                ]
            }
        ]
    },
    // EARTH
    {
        audioClips: [
            {
                file: new URL("../assets/audio/narrator/earth/earthintro.wav", import.meta.url).href,
                subtitles: [
                    { text: "The lively hotspot of the solar system. With wild weather and stunning sunsets, it's the place to be—just don't forget your sunscreen.", start: 0, end: 9 }
                ]
            },
            {
                file: new URL("../assets/audio/narrator/earth/earthfact1.wav", import.meta.url).href,
                subtitles: [
                    { text: "The Earth was once believed to be the center of the universe. Due to the apparent movements of the Sun and planets in relation to their viewpoint,", start: 0, end: 8 },
                    { text: "ancient scientists insisted that the Earth remained static, whilst other celestial bodies travelled in circular orbits around it.", start: 8, end: 15 }
                ]
            },
            {
                file: new URL("../assets/audio/narrator/earth/earthfact2.wav", import.meta.url).href,
                subtitles: [
                    { text: "Earth doesn't take 24 hours to rotate on its axis. It's actually 23 hours, 56 minutes, and 4 seconds. Astronomers call this a sidereal day.", start: 0, end: 10 }
                ]
            },
            {
                file: new URL("../assets/audio/narrator/earth/earthfact3.wav", import.meta.url).href,
                subtitles: [
                    { text: "Due to the gravitational pull of the Moon, Earth's rotation is gradually slowing down,", start: 0, end: 5 },
                    { text: "making days longer by about 1.7 milliseconds per century.", start: 5, end: 9 }
                ]
            }
        ]
    },
    // MARS
    {
        audioClips: [
            {
                file: new URL("../assets/audio/narrator/mars/marsintro.wav", import.meta.url).href,
                subtitles: [
                    { text: "The solar system's ultimate red rock star! With its dusty deserts and towering volcanoes,", start: 0, end: 6 },
                    { text: "it's like Earth's quirky cousin who decided to go for a 'no water' aesthetic.", start: 6, end: 10 }
                ]
            },
            {
                file: new URL("../assets/audio/narrator/mars/marsfact1.wav", import.meta.url).href,
                subtitles: [
                    { text: "Mars is home to the tallest mountain in the solar system.", start: 0, end: 4 },
                    { text: "Olympus Mons, a shield volcano, is 21km high and 600km in diameter. Despite having formed over billions of years,", start: 4, end: 13 },
                    { text: "evidence from volcanic lava flows is so recent many scientists believe it could still be active.", start: 13, end: 19 }
                ]
            },
            {
                file: new URL("../assets/audio/narrator/mars/marsfact2.wav", import.meta.url).href,
                subtitles: [
                    { text: "Mars has the largest dust storms in the solar system. They can last for months and cover the entire planet.", start: 0, end: 7 }
                ]
            },
            {
                file: new URL("../assets/audio/narrator/mars/marsfact3.wav", import.meta.url).href,
                subtitles: [
                    { text: "One day Mars will have a ring. In the next 20-40 million years, Mars' largest moon Phobos will be torn apart", start: 0, end: 7 },
                    { text: "by gravitational forces leading to the creation of a ring that could last up to 100 million years.", start: 7, end: 14 }
                ]
            },
            {
                file: new URL("../assets/audio/narrator/mars/marsfact4.wav", import.meta.url).href,
                subtitles: [
                    { text: "Pieces of Mars have fallen to Earth. Scientists have discovered tiny traces of Martian atmosphere in meteorites", start: 0, end: 6 },
                    { text: "that were violently ejected from Mars and spent millions of years traveling through space before landing on our planet.", start: 6, end: 12 }
                ]
            }
        ]
    },
    // JUPITER
    {
        audioClips: [
            {
                file: new URL("../assets/audio/narrator/jupiter/jupiterintro.wav", import.meta.url).href,
                subtitles: [
                    { text: "The solar system's giant gas king! With a storm bigger than Earth and more moons than you can count,", start: 0, end: 6 },
                    { text: "it's the ultimate cosmic heavyweight. Bigger, wilder, and full of surprises!", start: 6, end: 12 }
                ]
            },
            {
                file: new URL("../assets/audio/narrator/jupiter/jupiterfact1.wav", import.meta.url).href,
                subtitles: [
                    { text: "Jupiter has the shortest day of all the planets. It turns on its axis once every 9 hours and 55 minutes.", start: 0, end: 7 },
                    { text: "The rapid rotation flattens the planet slightly, giving it an oblate shape.", start: 7, end: 12 }
                ]
            },
            {
                file: new URL("../assets/audio/narrator/jupiter/jupiterfact2.wav", import.meta.url).href,
                subtitles: [
                    { text: "It is two and a half times more massive than all the other planets in the solar system combined.", start: 0, end: 5 }
                ]
            },
            {
                file: new URL("../assets/audio/narrator/jupiter/jupiterfact3.wav", import.meta.url).href,
                subtitles: [
                    { text: "It is made primarily of gases and is therefore known as a 'gas giant'.", start: 0, end: 5 }
                ]
            },
            {
                file: new URL("../assets/audio/narrator/jupiter/jupiterfact4.wav", import.meta.url).href,
                subtitles: [
                    { text: "Jupiter is the fourth brightest object in the solar system. Only the Sun, Moon, and Venus are brighter.", start: 0, end: 6 },
                    { text: "It is one of five planets visible to the naked eye from Earth.", start: 6, end: 10 }
                ]
            }
        ]
    },
    // SATURN
    {
        audioClips: [
            {
                file: new URL("../assets/audio/narrator/saturn/saturnintro.wav", import.meta.url).href,
                subtitles: [
                    { text: "The ringed royalty of the solar system. It's big, bold, and knows how to rock some serious space bling.", start: 0, end: 6 }
                ]
            },
            {
                file: new URL("../assets/audio/narrator/saturn/saturnfact1.wav", import.meta.url).href,
                subtitles: [
                    { text: "Saturn is the flattest planet. Its polar diameter is 90% of its equatorial diameter, this is due to its low density and fast rotation.", start: 0, end: 10 }
                ]
            },
            {
                file: new URL("../assets/audio/narrator/saturn/saturnfact2.wav", import.meta.url).href,
                subtitles: [
                    { text: "Saturn turns on its axis once every 10 hours and 34 minutes giving it the second-shortest day of any of the solar system's planets.", start: 0, end: 8 }
                ]
            },
            {
                file: new URL("../assets/audio/narrator/saturn/saturnfact3.wav", import.meta.url).href,
                subtitles: [
                    { text: "Saturn has more moons than any other planet. All are frozen worlds. The largest moons are Titan and Rhea.", start: 0, end: 7 },
                    { text: "20 new moons were discovered in 2019 bringing the total to 82.", start: 7, end: 12 }
                ]
            }
        ]
    },
    // URANUS
    {
        audioClips: [
            {
                file: new URL("../assets/audio/narrator/uranus/uranusintro.wav", import.meta.url).href,
                subtitles: [
                    { text: "The chillest planet around. Spinning on its side and sporting a cool blue vibe, it's the oddball that keeps things weird in the best way.", start: 0, end: 8 }
                ]
            },
            {
                file: new URL("../assets/audio/narrator/uranus/uranusfact1.wav", import.meta.url).href,
                subtitles: [
                    { text: "Uranus hits the coldest temperatures of any planet. With a minimum atmospheric temperature of -224°C,", start: 0, end: 8 },
                    { text: "Uranus is nearly the coldest planet in the solar system.", start: 8, end: 12 }
                ]
            },
            {
                file: new URL("../assets/audio/narrator/uranus/uranusfact3.wav", import.meta.url).href,
                subtitles: [
                    { text: "Uranus has two sets of very thin dark-colored rings. The ring particles are small, ranging from dust-sized particles to small boulders.", start: 0, end: 8 },
                    { text: "There are eleven inner rings and two outer rings. They probably formed when one or more of Uranus's moons were broken up in an impact.", start: 8, end: 14 }
                ]
            },
            {
                file: new URL("../assets/audio/narrator/uranus/uranusfact4.wav", import.meta.url).href,
                subtitles: [
                    { text: "Uranus is tipped over on its side with an axial tilt of 98 degrees. It is often described as 'rolling around the Sun on its side.'", start: 0, end: 8 }
                ]
            }
        ]
    },
    {
        audioClips: [
            {
                file: new URL("../assets/audio/narrator/neptune/neptuneintro.wav", import.meta.url).href,
                subtitles: [
                    { text: "The deep-blue giant of the solar system. With wild storms and supersonic winds, it's the cosmic ocean that never stops surprising.", start: 0, end: 9 }
                ]
            },
            {
                file: new URL("../assets/audio/narrator/neptune/neptunefact1.wav", import.meta.url).href,
                subtitles: [
                    { text: "Neptune spins on its axis very rapidly. Its equatorial clouds take 16 hours to make one rotation.", start: 0, end: 7 },
                    { text: "This is because Neptune is not a solid body.", start: 7, end: 9 }
                ]
            },
            {
                file: new URL("../assets/audio/narrator/neptune/neptunefact2.wav", import.meta.url).href,
                subtitles: [
                    { text: "Neptune is the smallest of the ice giants. Despite being smaller than Uranus, Neptune has a greater mass.", start: 0, end: 7 }
                ]
            },
            {
                file: new URL("../assets/audio/narrator/neptune/neptunefact3.wav", import.meta.url).href,
                subtitles: [
                    { text: "Neptune has a very active climate. Large storms whirl through its upper atmosphere,", start: 0, end: 5 },
                    { text: "and high-speed winds track around the planet at up to 600 meters per second.", start: 5, end: 10 }
                ]
            },
            {
                file: new URL("../assets/audio/narrator/neptune/neptunefact4.wav", import.meta.url).href,
                subtitles: [
                    { text: "Neptune has a very thin collection of rings.", start: 0, end: 3 },
                    { text: "They are likely made up of ice particles mixed with dust grains and possibly coated with a carbon-based substance.", start: 3, end: 10 }
                ]
            },
            {
                file: new URL("../assets/audio/narrator/neptune/neptunefact5.wav", import.meta.url).href,
                subtitles: [
                    { text: "Neptune has 14 moons. The most interesting moon is Triton,", start: 0, end: 4 },
                    { text: "a frozen world that is spewing nitrogen ice and dust particles out from below its surface. ", start: 4, end: 9 },
                    { text: "It was likely captured by the gravitational pull of Neptune. It is probably the coldest world in the solar system.", start: 9, end: 15 }
                ]
            }
        ]
    },
    // MOON
    {
        audioClips: [
            {
                file: new URL("../assets/audio/narrator/moon/moonintro.wav", import.meta.url).href,
                subtitles: [
                    { text: "Earth's trusty sidekick. With its glowing nights and quirky craters, it's the ultimate celestial hangout that's always ready for a lunar adventure.", start: 0, end: 8 }
                ]
            },
            {
                file: new URL("../assets/audio/narrator/moon/moonfact1.wav", import.meta.url).href,
                subtitles: [
                    { text: "The Moon is the largest satellite of any planet in our solar system. In real terms, however, it is only the fifth largest natural satellite.", start: 0, end: 8 }
                ]
            },
            {
                file: new URL("../assets/audio/narrator/moon/moonfact2.wav", import.meta.url).href,
                subtitles: [
                    { text: "Just like Earth has earthquakes, the Moon has moonquakes! These can be caused by tidal forces from Earth or meteor impacts.", start: 0, end: 7 }
                ]
            },
            {
                file: new URL("../assets/audio/narrator/moon/moonfact3.wav", import.meta.url).href,
                subtitles: [
                    { text: "The dark patches on the Moon, called 'maria', are ancient volcanic plains, giving the Moon its iconic appearance.", start: 0, end: 7 },
                    { text: "'maria' means 'seas' in Latin, even though they're not water.", start: 7, end: 11 }
                ]
            },
            {
                file: new URL("../assets/audio/narrator/moon/moonfact4.wav", import.meta.url).href,
                subtitles: [
                    { text: "The footprints left by astronauts on the Moon could last for millions of years because there's no wind or water to erode them.", start: 0, end: 7 }
                ]
            }
        ]
    },
    {// ASTEROID
        audioClips: [
            {
                file: new URL("../assets/audio/narrator/asteroids/asteroid1.wav", import.meta.url).href,
                subtitles: [
                    { text: "Asteroids, comets, and other celestial objects trace their orbits around Earth", start: 0, end: 5 },
                    { text: " moving in silent loops through the vast expanse of space.", start: 5, end: 9 }

                ]
            },
            {
                file: new URL("../assets/audio/narrator/asteroids/asteroid2.wav", import.meta.url).href,
                subtitles: [
                    { text: "Planets this, planets that. What about those rocks travelling through space around us? ", start: 0, end: 5 },
                    { text: " As underrated as they are, these little rascals sure are fascinating.", start: 5, end: 10 }

                ]
            },
        ]
    }
];

