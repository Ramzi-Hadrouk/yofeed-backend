import { drizzle } from 'drizzle-orm/postgres-js';
import { seed } from 'drizzle-seed';
import postgres from 'postgres';
import * as schema  from 'src/database/schema' ; // Adjust the path to your schema

// Database connection
const connectionString = process.env.DATABASE_URL || 'postgresql://user:password@localhost:5432/dbname';
const client = postgres(connectionString);
const db = drizzle(client);

async function main() {
  try {
    console.log('🌱 Starting seed process with drizzle-seed...');

    // Optional: Clear existing data
    // await reset(db, schema);

    // Algerian names for more realistic data
    const algerianFirstNames = [
      'Ahmed', 'Mohamed', 'Yacine', 'Karim', 'Omar', 'Reda', 'Amine', 'Nabil', 'Sofiane', 'Bilal',
      'Fatima', 'Amina', 'Lina', 'Salma', 'Nadia', 'Khadija', 'Aicha', 'Malika', 'Yamina', 'Soraya'
    ];

    const algerianLastNames = [
      'Benali', 'Khelifi', 'Boudjema', 'Meziane', 'Hadji', 'Benaissa', 'Cherif', 'Tounsi', 
      'Abderahim', 'Hamidi', 'Messaoudi', 'Bencherif', 'Lakhdari', 'Benabdallah', 'Zerrouki'
    ];

    // Algerian cities (matching your enum)
    const algerianCities = [
      'ALGIERS', 'ORAN', 'CONSTANTINE', 'SETIF', 'BATNA', 'BLIDA', 'BEJAIA', 
      'TLEMCEN', 'SKIKDA', 'ANNABA', 'GUELMA', 'JIJEL', 'MOSTAGANEM', 'TIZI_OUZOU'
    ];

    // Professional bios for different user types
    const professionalBios = [
      'Software engineer passionate about web development and open source',
      'Data scientist specializing in machine learning and AI applications',
      'Full-stack developer with expertise in modern JavaScript frameworks',
      'Cybersecurity expert focused on ethical hacking and penetration testing',
      'UX/UI designer creating accessible and user-centered digital experiences',
      'DevOps engineer with experience in cloud computing and automation',
      'Mobile app developer for iOS and Android platforms',
      'Blockchain developer interested in DeFi and smart contracts',
      'AI researcher working on natural language processing',
      'Tech entrepreneur building innovative SaaS solutions'
    ];

    // Sample tech companies and universities in Algeria
    const techDomains = [
      'techalgeria', 'innovedz', 'startupalgiers', 'techoran', 'algeriatech',
      'univ-constantine2', 'usthb', 'univ-blida2', 'univ-setif'
    ];

    // Token types for realistic distribution
    const tokenTypes = [
      'EMAIL_VERIFICATION',
      'PASSWORD_RESET', 
      'EMAIL_CHANGE',
      'ACCOUNT_DELETION',
      'TWO_FACTOR_AUTH'
    ];

    // Phone number prefixes for Algeria
    const phonePrefix = ['0550', '0551', '0552', '0553', '0554', '0555', '0556', '0557', '0558', '0559'];

    await seed(db, { users: schema.users, tokens: schema.tokens }, { 
      count: 10,  // Generate 10 users
      seed: 123456 // For reproducible results
    }).refine((funcs) => ({
      users: {
        count: 10,
        columns: {
          // Use Algerian first and last names
          firstName: funcs.valuesFromArray({ 
            values: algerianFirstNames 
          }),
          lastName: funcs.valuesFromArray({ 
            values: algerianLastNames 
          }),
          
          // Generate realistic email addresses with tech domains
          email: funcs.email(),
          
          // Hash passwords properly (this will generate "Password123!" hashed)
          passwordHash: funcs.string({ isUnique: true }),
          
          // Weighted role distribution: mostly users, some organizers, few admins/moderators
          role: funcs.weightedRandom([
            { weight: 0.6, value: 'USER' },      // 60% users
            { weight: 0.2, value: 'ORGANIZER' }, // 20% organizers  
            { weight: 0.1, value: 'MODERATOR' }, // 10% moderators
            { weight: 0.1, value: 'ADMIN' }      // 10% admins
          ]),
          
          // Most users are active and verified
          isActive: funcs.weightedRandom([
            { weight: 0.9, value: true },
            { weight: 0.1, value: false }
          ]),
          
          isVerified: funcs.weightedRandom([
            { weight: 0.8, value: true },
            { weight: 0.2, value: false }
          ]),
          
          // Professional bios
          bio: funcs.valuesFromArray({ 
            values: professionalBios 
          }),
          
          // Algerian phone numbers
          phoneNumber: funcs.phoneNumber({
            prefixes: phonePrefix,
            generatedDigitsNumbers: 6
          }),
          
          // Ages between 20-50
          dateOfBirth: funcs.date({
            minDate: '1974-01-01',
            maxDate: '2004-12-31'
          }),
          
          // Algerian cities
          city: funcs.valuesFromArray({ 
            values: algerianCities 
          }),
          
          // Language preferences (mostly French, some Arabic)
          preferredLanguage: funcs.weightedRandom([
            { weight: 0.7, value: 'fr' },
            { weight: 0.3, value: 'ar' }
          ]),
          
          // Notification preferences
          emailNotifications: funcs.weightedRandom([
            { weight: 0.8, value: true },
            { weight: 0.2, value: false }
          ]),
          
          pushNotifications: funcs.weightedRandom([
            { weight: 0.7, value: true },
            { weight: 0.3, value: false }
          ]),
          
          // Recent login times (within last 30 days)
          lastLoginAt: funcs.date({
            minDate: '2025-07-30',
            maxDate: '2025-08-29'
          })
        },
        
        // Each user will have 1-3 tokens
        with: {
          tokens: funcs.weightedRandom([
            { weight: 0.4, count: [1] },      // 40% have 1 token
            { weight: 0.4, count: [2] },      // 40% have 2 tokens
            { weight: 0.2, count: [3] }       // 20% have 3 tokens
          ])
        }
      },
      
      tokens: {
        columns: {
          // Various token types with realistic distribution
          type: funcs.weightedRandom([
            { weight: 0.4, value: 'EMAIL_VERIFICATION' },
            { weight: 0.3, value: 'PASSWORD_RESET' },
            { weight: 0.15, value: 'EMAIL_CHANGE' },
            { weight: 0.1, value: 'TWO_FACTOR_AUTH' },
            { weight: 0.05, value: 'ACCOUNT_DELETION' }
          ]),
          
          // Unique token hashes
          tokenHash: funcs.string({ isUnique: true }),
          
          // Expiry dates (1 hour to 7 days from now)
          expiresAt: funcs.date({
            minDate: '2025-08-29T01:00:00',  // 1 hour from now
            maxDate: '2025-09-05T23:59:59'   // 7 days from now
          }),
          
          // Some tokens are already used (30% chance)
          usedAt: funcs.weightedRandom([
            { weight: 0.7, value: null },
            { weight: 0.3, value: funcs.date({
              minDate: '2025-08-28T00:00:00',
              maxDate: '2025-08-29T00:00:00'
            })}
          ]),
          
          // Creation dates within last week
          createdAt: funcs.date({
            minDate: '2025-08-22T00:00:00',
            maxDate: '2025-08-29T00:00:00'
          })
        }
      }
    }));

    console.log('✅ Seed completed successfully!');
    console.log('📊 Generated:');
    console.log('  - 10 users with realistic Algerian data');
    console.log('  - Various user roles (weighted distribution)');
    console.log('  - 1-3 tokens per user (weighted distribution)');
    console.log('  - Realistic phone numbers and email addresses');
    console.log('  - Professional bios and preferences');

  } catch (error) {
    console.error('❌ Seed failed:', error);
    throw error;
  } finally {
    await client.end();
  }
}

// Execute if run directly
if (require.main === module) {
  main()
    .then(() => {
      console.log('🎉 Seed process completed');
      process.exit(0);
    })
    .catch((error) => {
      console.error('💥 Seed process failed:', error);
      process.exit(1);
    });
}

export { main as seed };