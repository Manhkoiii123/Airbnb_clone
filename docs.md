cài prisma
npm i -d prisma
npx prisma init
=> tạo ra folder prisma và tự thêm vào file env 1 cái urldb

```ts
datasource db {
  provider = "mongodb"//cái này là tên db
  url      = env("DATABASE_URL")
}

```

tạo trên compass lấy url kết nối với mongo => sửa vào cái DATABASE_URL của env
thiết kế db

```prisma

generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "mongodb"
  url      = env("DATABASE_URL")
}
model User {
  id String @id @default(auto()) @map("_id") @db.ObjectId
  email String? @unique
  name String?
  emailVerified DateTime?
  image String?
  hashedPassword String? //optional do có login bằng git gg
  createdAt DateTime @default(now())
  updatedAt DateTime @default(now())
  favouriteIds String[] @db.ObjectId
  accounts Account[]
  listings Listing[]
  reservations Revervation[]
}
model Account {
  id String @id @default(auto()) @map("_id") @db.ObjectId
  userId String @db.ObjectId
  type String
  provider String
  providerAccountId String
  refresh_token String? @db.String
  access_token String @db.String
  expires_at Int?
  token_type String?
  scopes String[]
  id_token String @db.String
  session_state String @db.String
  user User @relation(fields: [userId],references: [id],onDelete:Cascade)
  @@unique([provider,providerAccountId])
}

model Listing {
  id String @id @default(auto()) @map("_id") @db.ObjectId
  title String
  description String
  imageSrc String
  createdAt DateTime @default(now())
  category String
  roomCount Int
  bathroomCount Int
  guestCount Int
  locationValue String
  userId String @db.ObjectId
  price Int
  user User @relation(fields: [userId],references: [id],onDelete:Cascade)
  revervations Revervation[]
}
model Revervation {
  id String @id @default(auto()) @map("_id") @db.ObjectId
  userId String @db.ObjectId
  listingId String @db.ObjectId
  startDate DateTime
  endDate DateTime
  totalPrice Int
  createdAt DateTime @default(now())
  user User @relation(fields: [userId],references: [id],onDelete:Cascade)
  listing Listing @relation(fields: [listingId],references: [id],onDelete:Cascade)
}
```

đẩy lên db = npx prisma db push

# register

cài npm i next-auth @prisma/client @next-auth/prisma-adapter bcrypt
npm i -D @types/bcrypt
tạo app/libs/prismadb.ts

```ts
import { PrismaClient } from "@prisma/client";
declare global {
  var prisma: PrismaClient | undefined;
}
const client = globalThis.prisma || new PrismaClient();
if (process.env.NODE_ENV !== "production") globalThis.prisma = client;
export default client;
```

docs https://authjs.dev/getting-started/adapters/prisma
tạo pages/api/[...nextauth].ts (pages ngang cấp với app)

```ts
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import NextAuth, { AuthOptions } from "next-auth";
import prisma from "@/app/libs/prismadb";
import GithubProvider from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcrypt";
export const authOptions: AuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_ID as string,
      clientSecret: process.env.GITHUB_SECRET as string,
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    }),
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "email", type: "text" },
        password: { label: "password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Invalid credentials");
        }

        const user = await prisma.user.findUnique({
          where: {
            email: credentials.email,
          },
        });

        if (!user || !user?.hashedPassword) {
          throw new Error("Invalid credentials");
        }
        const isCorrectPassword = await bcrypt.compare(
          credentials.password,
          user.hashedPassword
        );
        if (isCorrectPassword) {
          throw new Error("Invalid credentials");
        }
        return user;
      },
    }),
  ],
  pages: {
    signIn: "/",
  },
  debug: process.env.NODE_ENV === "development",
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,
};
export default NextAuth(authOptions);
```

viết app/api/register/route.ts

```ts
import bcrypt from "bcrypt";
import prisma from "@/app/libs/prismadb";
import { NextResponse } from "next/server";
export async function POST(req: Request) {
  const body = await req.json();
  const { email, name, password } = body;
  const hashedPassword = await bcrypt.hash(password, 12);
  const user = await prisma.user.create({
    data: {
      email,
      name,
      hashedPassword,
    },
  });
  return NextResponse.json(user);
}
```

call bên RegisterModal.tsx

```ts
const onSubmit: SubmitHandler<FieldValues> = (data) => {
  setIsLoading(true);

  axios
    .post("/api/register", data)
    .then(() => {
      registerModal.onClose();
    })
    .catch((e) => {
      toast.error("Something went wrong");
    })
    .finally(() => {
      setIsLoading(false);
    });
};
```
