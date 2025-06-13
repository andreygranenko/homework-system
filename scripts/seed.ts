import { PrismaClient } from "../lib/generated/prisma"
import bcrypt from "bcryptjs"

const prisma = new PrismaClient()

async function main() {
  console.log("Seeding database...")

  // Создаем учителя
  const hashedPassword = await bcrypt.hash("password123", 10)
  
  const teacher = await prisma.user.upsert({
    where: { email: "teacher@example.com" },
    update: {},
    create: {
      email: "teacher@example.com",
      name: "John Teacher",
      role: "TEACHER",
      password: hashedPassword,
    },
  })

  // Создаем студента
  const student = await prisma.user.upsert({
    where: { email: "student@example.com" },
    update: {},
    create: {
      email: "student@example.com",
      name: "Jane Student",
      role: "STUDENT",
      password: hashedPassword,
    },
  })

  // Создаем предметы
  const subjects = [
    {
      name: "Mathematics",
      description: "Advanced mathematics course covering algebra, calculus, and geometry",
      teacherId: teacher.id,
    },
    {
      name: "Science",
      description: "General science course covering physics, chemistry, and biology",
      teacherId: teacher.id,
    },
    {
      name: "Literature",
      description: "English literature course covering classical and modern works",
      teacherId: teacher.id,
    },
    {
      name: "History",
      description: "World history course covering ancient to modern times",
      teacherId: teacher.id,
    },
    {
      name: "Physics",
      description: "Physics course covering mechanics, thermodynamics, and electromagnetism",
      teacherId: teacher.id,
    },
    {
      name: "Chemistry",
      description: "Chemistry course covering organic and inorganic chemistry",
      teacherId: teacher.id,
    },
  ]

  for (const subject of subjects) {
    const existingSubject = await prisma.subject.findFirst({
      where: { 
        name: subject.name,
        teacherId: subject.teacherId,
      }
    })
    
    if (!existingSubject) {
      await prisma.subject.create({
        data: subject,
      })
      console.log(`Created subject: ${subject.name}`)
    } else {
      console.log(`Subject already exists: ${subject.name}`)
    }
  }

  console.log("Database seeded successfully!")
  console.log("Teacher email: teacher@example.com")
  console.log("Student email: student@example.com")
  console.log("Password for both: password123")
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  }) 