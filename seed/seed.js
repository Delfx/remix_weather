const { PrismaClient } = require('@prisma/client');
const { faker } = require('@faker-js/faker');

const prisma = new PrismaClient();
const cities = ['Kaunas', 'Vilnius', 'Klaipeda'];

async function main() {
    for (let i = 0; i < 5; i++) { // adjust the count as needed
        const user = await prisma.user.create({
            data: {
                email: faker.internet.email(),
                name: faker.person.fullName(),
                pass: faker.internet.password(),
                cities: {
                    create: Array.from({ length: 5 }, () => ({ // each user will have 5 cities
                        city: cities[Math.floor(Math.random() * cities.length)], // randomly select one of the cities
                    })),
                },
            },
        });
        console.log(`Created user with id ${user.id}`);
    }
}

main()
    .catch(e => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });

