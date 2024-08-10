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
  scope String?
  id_token String? @db.String
  session_state String?
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
tạo pages/api/auth/[...nextauth].ts (pages ngang cấp với app)
do next auth nó chưa hỗ trợ cho app router

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
        if (!isCorrectPassword) {
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

# login functional

Hàm onsubmit của cái login modal dùng signIn của thư viện luôn

```ts
import { signIn } from "next-auth/react";
const onSubmit: SubmitHandler<FieldValues> = (data) => {
  setIsLoading(true);
  signIn("credentials", {
    ...data,
    redirect: false,
  }).then((callback) => {
    setIsLoading(false);
    if (callback?.ok) {
      router.refresh();
      toast.success("Logged in");
      loginModal.onClose();
    }
    if (callback?.error) {
      toast.error(callback.error);
    }
  });
};
```

lấy thông tin người dùng
tạo app/actions/getCurrentUser.ts

```ts
import { authOptions } from "@/pages/api/auth/[...nextauth]";
import { getServerSession } from "next-auth";
import prisma from "@/app/libs/prismadb";

export async function getSession() {
  return await getServerSession(authOptions);
}
export default async function getCurrentUser() {
  try {
    const session = await getSession();
    if (!session?.user?.email) return null;
    const user = await prisma.user.findUnique({
      where: {
        email: session.user.email as string,
      },
    });
    if (!user) {
      return null;
    }
    return {
      ...user,
      //fix lỗi plain object ...
      createdAt: user.createdAt.toISOString(),
      updatedAt: user.updatedAt.toISOString(),
      emailVerified: user.emailVerified?.toISOString() || null,
    };
  } catch (error) {
    console.log("🚀 ~ getCurrentUser ~ error:", error);
    return null;
  }
}
```

sử dụng bên layout.tsx (to nhất)

```ts
const user = await getCurrentUser();
console.log("🚀 ~ user:", user);

return (
  <html lang="en">
    <body className={font.className}>
      <ClientOnly>
        <ToasterProvider />
        <RegisterModal />
        <LoginModal />
        <Navbar currentUser={user} /> // lỗi ts do đã đưa cái updatedAt.. thành string
        nhưng trong schema nó đã Date
      </ClientOnly>
      {children}
    </body>
  </html>
);
```

khi sử dụng định kiểu dữ liệu

```ts
currentUser?: User | null;//dùng với cái cũ (return user) => lỗi ts
```

khi đó phỉa định lại type cho cái `getCurrentUser` trả về

```ts
import { User } from "@prisma/client";

export type SafeUser = Omit<
  User,
  "createdAt" | "updatedAt" | "emailVerified"
> & {
  createdAt: string;
  updatedAt: string;
  emailVerified: string | null;
};
```

khi đó dùng

```ts
currentUser?: SafeUser | null;
```

dùng để render giao diện usermenu => ok
logout

```ts
import { signOut } from "next-auth/react";
<MenuItem onClick={() => signOut()} label="Logout" />;
```

# social login

1. github
   vào githutb => setting => developer setting => oauthApp => new
   điền => có được clientId và sercet
   sau đó đến cái button lg github

```ts
onClick={() => signIn("github")}
```

2. googlo
   vào google cloud => api & services => credentials => OAuth 2.0 client IDs
   sau khi điền xong => creadentai => create o auth cliend id => Authorized redirect URIs
   điền cái ày http://localhost:3000/api/auth/callback/google

# upload ảnh

cách cài đặt : https://next.cloudinary.dev/installation
env : https://console.cloudinary.com/pm/c-018d757ecb9d27ec1ea4e679bc9004/developer-dashboard (1)

```ts
<CldUploadWidget
      onUpload={handleUpload}
      uploadPreset="aaaa"
      options={{
        maxFiles: 1,
      }}
    >
```

lấy cái `uploadPreset` tại đâu

- vào 1 chọn setting => upload => upload presets => add uploadpresets\
- Signing Mode: đổi sang unsign
- copy cái upload presetname
- patse vào cái `uploadPreset="aaaa"` là ok
