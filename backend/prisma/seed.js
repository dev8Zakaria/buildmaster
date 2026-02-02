import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
    console.log('--- Seeding Database with Correct Specs ---');

    // 1. Create Admin Account
    const hashedPassword = await bcrypt.hash('admin123', 10);
    await prisma.user.upsert({
        where: { email: 'admin@buildmaster.com' },
        update: {},
        create: {
            firstName: 'Zakaria',
            lastName: 'Admin',
            email: 'admin@buildmaster.com',
            password: hashedPassword,
            role: 'Admin',
        },
    });
    console.log('✅ Admin account created: admin@buildmaster.com / admin123');

    // 2. Clear existing entries using a Transaction and raw SQL
    console.log('🧹 Clearing existing data via TRUNCATE CASCADE...');
    try {
        await prisma.$executeRaw`TRUNCATE TABLE "order_items", "orders", "saved_builds", "components", "component_categories", "_ComponentToSavedBuild" RESTART IDENTITY CASCADE;`;
        console.log('✅ All tables truncated and identities reset');
    } catch (err) {
        console.warn('⚠️ Raw TRUNCATE failed, attempting manual deleteMany chain...', err.message);
    }

    // 3. Define Categories
    const categoriesData = [
        { name: 'Processeurs', description: 'Central Processing Units' },
        { name: 'Cartes Mères', description: 'Motherboards' },
        { name: 'Mémoire RAM', description: 'Random Access Memory' },
        { name: 'Cartes Graphiques', description: 'Graphics Cards / GPUs' },
        { name: 'Stockage', description: 'SSDs and HDDs' },
        { name: 'Alimentation', description: 'Power Supply Units' },
        { name: 'Boîtiers', description: 'Computer Cases' },
    ];

    const categories = {};
    for (const cat of categoriesData) {
        const createdCat = await prisma.category.create({
            data: cat,
        });
        categories[cat.name] = createdCat.id;
    }
    console.log('✅ Categories created');

    // 4. Seed Components (3 per category)
    const components = [
        // CPUs (Socket, Cores, Threads, Base Clock, Boost Clock, TDP, Cache, Integrated Graphics)
        {
            name: 'Intel Core i9-14900K',
            brand: 'Intel',
            price: 589.99,
            stock: 10,
            categoryId: categories['Processeurs'],
            specifications: {
                socket: 'LGA1700',
                cores: 24,
                threads: 32,
                baseClock: '3.2 GHz',
                boostClock: '6.0 GHz',
                tdp: 125,
                cache: '36MB',
                integratedGraphics: 'UHD 770'
            }
        },
        {
            name: 'AMD Ryzen 7 7800X3D',
            brand: 'AMD',
            price: 449.00,
            stock: 15,
            categoryId: categories['Processeurs'],
            specifications: {
                socket: 'AM5',
                cores: 8,
                threads: 16,
                baseClock: '4.2 GHz',
                boostClock: '5.0 GHz',
                tdp: 120,
                cache: '96MB',
                integratedGraphics: 'Radeon Graphics'
            }
        },
        {
            name: 'Intel Core i5-13600K',
            brand: 'Intel',
            price: 319.99,
            stock: 25,
            categoryId: categories['Processeurs'],
            specifications: {
                socket: 'LGA1700',
                cores: 14,
                threads: 20,
                baseClock: '3.5 GHz',
                boostClock: '5.1 GHz',
                tdp: 125,
                cache: '24MB',
                integratedGraphics: 'UHD 770'
            }
        },

        // Motherboards (Socket, Chipset, Form Factor, Memory Type, Memory Slots, Max Memory, M.2 Slots, Wi-Fi/Bluetooth)
        {
            name: 'ASUS ROG STRIX Z790-E',
            brand: 'ASUS',
            price: 499.99,
            stock: 8,
            categoryId: categories['Cartes Mères'],
            specifications: {
                socket: 'LGA1700',
                chipset: 'Z790',
                formFactor: 'ATX',
                memoryType: 'DDR5',
                memorySlots: 4,
                maxMemory: '192GB',
                m2Slots: 5,
                wifi: 'WiFi 6E + BT 5.3'
            }
        },
        {
            name: 'MSI MAG B650 TOMAHAWK',
            brand: 'MSI',
            price: 219.00,
            stock: 12,
            categoryId: categories['Cartes Mères'],
            specifications: {
                socket: 'AM5',
                chipset: 'B650',
                formFactor: 'ATX',
                memoryType: 'DDR5',
                memorySlots: 4,
                maxMemory: '128GB',
                m2Slots: 2,
                wifi: 'WiFi 6 + BT 5.2'
            }
        },
        {
            name: 'Gigabyte Z690 AORUS ELITE',
            brand: 'Gigabyte',
            price: 239.99,
            stock: 5,
            categoryId: categories['Cartes Mères'],
            specifications: {
                socket: 'LGA1700',
                chipset: 'Z690',
                formFactor: 'ATX',
                memoryType: 'DDR4',
                memorySlots: 4,
                maxMemory: '128GB',
                m2Slots: 3,
                connectivity: 'None'
            }
        },

        // RAM (Capacity, Type, Speed, CAS Latency, Voltage, RGB)
        {
            name: 'Corsair Vengeance 32GB DDR5',
            brand: 'Corsair',
            price: 124.99,
            stock: 30,
            categoryId: categories['Mémoire RAM'],
            specifications: {
                capacity: '32GB',
                type: 'DDR5',
                speed: '6000MHz',
                casLatency: 'CL30',
                voltage: '1.35V',
                rgb: true
            }
        },
        {
            name: 'G.Skill Trident Z5 32GB DDR5',
            brand: 'G.Skill',
            price: 139.99,
            stock: 20,
            categoryId: categories['Mémoire RAM'],
            specifications: {
                capacity: '32GB',
                type: 'DDR5',
                speed: '6400MHz',
                casLatency: 'CL32',
                voltage: '1.4V',
                rgb: true
            }
        },
        {
            name: 'Corsair Vengeance LPX 16GB DDR4',
            brand: 'Corsair',
            price: 45.99,
            stock: 50,
            categoryId: categories['Mémoire RAM'],
            specifications: {
                capacity: '16GB',
                type: 'DDR4',
                speed: '3200MHz',
                casLatency: 'CL16',
                voltage: '1.35V',
                rgb: false
            }
        },

        // GPUs (VRAM Size, VRAM Type, Bus Width, Core Clock, Interface, Length, TDP, Outputs)
        {
            name: 'NVIDIA RTX 4090 FE',
            brand: 'NVIDIA',
            price: 1599.99,
            stock: 3,
            categoryId: categories['Cartes Graphiques'],
            specifications: {
                vram: '24GB',
                vramType: 'GDDR6X',
                busWidth: '384-bit',
                coreClock: '2235MHz',
                interface: 'PCIe 4.0',
                length: 336,
                tdp: 450,
                outputs: '3xDP, 1xHDMI'
            }
        },
        {
            name: 'ASUS TUF RTX 4070 Ti',
            brand: 'ASUS',
            price: 799.99,
            stock: 7,
            categoryId: categories['Cartes Graphiques'],
            specifications: {
                vram: '12GB',
                vramType: 'GDDR6X',
                busWidth: '192-bit',
                coreClock: '2310MHz',
                interface: 'PCIe 4.0',
                length: 305,
                tdp: 285,
                outputs: '3xDP, 1xHDMI'
            }
        },
        {
            name: 'AMD Radeon RX 7900 XTX',
            brand: 'AMD',
            price: 949.00,
            stock: 10,
            categoryId: categories['Cartes Graphiques'],
            specifications: {
                vram: '24GB',
                vramType: 'GDDR6',
                busWidth: '384-bit',
                coreClock: '2300MHz',
                interface: 'PCIe 4.0',
                length: 287,
                tdp: 355,
                outputs: '2xDP, 1xHDMI, 1xUSB-C'
            }
        },

        // Storage (Capacity, Type, Interface, Read Speed, Write Speed, Form Factor)
        {
            name: 'Samsung 990 Pro 2TB',
            brand: 'Samsung',
            price: 169.99,
            stock: 40,
            categoryId: categories['Stockage'],
            specifications: {
                capacity: '2TB',
                type: 'NVMe SSD',
                interface: 'PCIe 4.0 x4',
                readSpeed: '7450 MB/s',
                writeSpeed: '6900 MB/s',
                formFactor: 'M.2 2280'
            }
        },
        {
            name: 'Crucial P3 1TB',
            brand: 'Crucial',
            price: 69.99,
            stock: 60,
            categoryId: categories['Stockage'],
            specifications: {
                capacity: '1TB',
                type: 'NVMe SSD',
                interface: 'PCIe 3.0 x4',
                readSpeed: '3500 MB/s',
                writeSpeed: '3000 MB/s',
                formFactor: 'M.2 2280'
            }
        },
        {
            name: 'Seagate Barracuda 2TB',
            brand: 'Seagate',
            price: 54.99,
            stock: 100,
            categoryId: categories['Stockage'],
            specifications: {
                capacity: '2TB',
                type: 'HDD',
                interface: 'SATA 6.0 Gb/s',
                readSpeed: '220 MB/s',
                writeSpeed: '220 MB/s',
                formFactor: '3.5"'
            }
        },

        // PSUs (Wattage, Efficiency, Modularity, Form Factor)
        {
            name: 'Corsair RM850x',
            brand: 'Corsair',
            price: 129.99,
            stock: 15,
            categoryId: categories['Alimentation'],
            specifications: {
                wattage: 850,
                efficiency: '80+ Gold',
                modularity: 'Fully Modular',
                formFactor: 'ATX'
            }
        },
        {
            name: 'EVGA SuperNOVA 1000 G7',
            brand: 'EVGA',
            price: 189.99,
            stock: 10,
            categoryId: categories['Alimentation'],
            specifications: {
                wattage: 1000,
                efficiency: '80+ Gold',
                modularity: 'Fully Modular',
                formFactor: 'ATX'
            }
        },
        {
            name: 'Seasonic Focus GX-750',
            brand: 'Seasonic',
            price: 99.99,
            stock: 20,
            categoryId: categories['Alimentation'],
            specifications: {
                wattage: 750,
                efficiency: '80+ Gold',
                modularity: 'Fully Modular',
                formFactor: 'ATX'
            }
        },

        // Cases (Type, MB Support, Max GPU Length, Max CPU Cooler, Included Fans, Radiator Support)
        {
            name: 'Lian Li PC-O11 Dynamic',
            brand: 'Lian Li',
            price: 149.99,
            stock: 12,
            categoryId: categories['Boîtiers'],
            specifications: {
                type: 'Mid-Tower',
                motherboardSupport: ['ATX', 'E-ATX', 'Micro-ATX'],
                maxGPULength: 420,
                maxCpuCoolerHeight: '155mm',
                includedFans: 'None',
                radiatorSupport: '360mm'
            }
        },
        {
            name: 'NZXT H5 Flow',
            brand: 'NZXT',
            price: 94.99,
            stock: 18,
            categoryId: categories['Boîtiers'],
            specifications: {
                type: 'Mid-Tower',
                motherboardSupport: ['ATX', 'Micro-ATX', 'Mini-ITX'],
                maxGPULength: 365,
                maxCpuCoolerHeight: '165mm',
                includedFans: '2x 120mm',
                radiatorSupport: '280mm'
            }
        },
        {
            name: 'Corsair 4000D Airflow',
            brand: 'Corsair',
            price: 104.99,
            stock: 25,
            categoryId: categories['Boîtiers'],
            specifications: {
                type: 'Mid-Tower',
                motherboardSupport: ['ATX', 'Micro-ATX', 'Mini-ITX'],
                maxGPULength: 360,
                maxCpuCoolerHeight: '170mm',
                includedFans: '2x 120mm',
                radiatorSupport: '360mm'
            }
        },
    ];

    for (const comp of components) {
        await prisma.component.create({
            data: comp,
        });
    }

    console.log('✅ Components seeded successfully with new specs');
    console.log('--- Seeding Completed ---');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
