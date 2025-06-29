import { PrismaClient } from "../../generated/prisma";

const prisma = new PrismaClient({
  log: [
    {
      emit: 'event',
      level: 'query',
    },
    {
      emit: 'stdout',
      level: 'error',
    },
    {
      emit: 'stdout',
      level: 'info',
    },
    {
      emit: 'stdout',
      level: 'warn',
    },
  ],
})

prisma.$on('query', (e) => {
  console.log('Query: ' + e.query)
  console.log("----------------------------------------------------------------------")
  console.log('Params: ' + e.params)
  console.log("----------------------------------------------------------------------")
  console.log('Duration: ' + e.duration + 'ms')
})

export default prisma;

