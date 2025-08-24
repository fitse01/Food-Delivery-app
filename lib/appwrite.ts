import { CreateUserParams, GetMenuParams, SignInParams } from "@/type";
import { Account, Avatars, Client, Databases, Functions, ID, Query, Storage } from "react-native-appwrite";

export const appwriteConfig = {
    endpoint: process.env.EXPO_PUBLIC_APPWRITE_ENDPOINT || "https://nyc.cloud.appwrite.io/v1",
    projectId: process.env.EXPO_PUBLIC_APPWRITE_PROJECT_ID || "688c77fc00079e445344",
    platform: "com.fitsum.foodordering ",
    databaseId: "688ca1b10020a4d1923e",
    bucketId: "6898345300176ca4474e",
    userCollectionId: "688ca21f0025bd475f14",
    categoriesCollectionId: "689821de00397dbc7640",
    menuCollectionId: "6898250500137d919c7e",
    customizationsCollectionId: "68982e1b0029bb780932",
    menuCustomizationsCollectionId: "689831a40021384ce1fd",
    paymentsCollectionId: "68a6a209000c4fbb0cab"
}


export const client = new Client()

client
    .setEndpoint(appwriteConfig.endpoint)
    .setProject(appwriteConfig.projectId)
    .setPlatform(appwriteConfig.platform)

export const account = new Account(client);
export const databases = new Databases(client);
export const storage = new Storage(client);
export const functions = new Functions(client);


const avatars = new Avatars(client);

export const createUser = async ({ email, password, name }: CreateUserParams) => {
    try {
        const newAccount = await account.create(ID.unique(), email, password, name)
        if (!newAccount) throw Error;

        await signIn({ email, password });

        const avatarUrl = avatars.getInitialsURL(name);

        const newUser = await databases.createDocument(
            appwriteConfig.databaseId,
            appwriteConfig.userCollectionId,
            ID.unique(),
            { email, name, accountId: newAccount.$id, avatar: avatarUrl }
        );
        return newUser;
    } catch (e) {
        throw new Error(e as string);
    }
}

export const signIn = async ({ email, password }: SignInParams) => {
    try {
        const session = await account.createEmailPasswordSession(email, password);
    } catch (e) {
        throw new Error(e as string);
    }
}

export const getCurrentUser = async () => {
    try {
        const currentAccount = await account.get();
        if (!currentAccount) throw Error;

        const currentUser = await databases.listDocuments(
            appwriteConfig.databaseId,
            appwriteConfig.userCollectionId,
            [Query.equal('accountId', currentAccount.$id)]
        )

        if (!currentUser) throw Error;

        return currentUser.documents[0];
    } catch (e) {
        console.log(e);
        throw new Error(e as string);
    }
}

export const getMenu = async ({ category, query }: GetMenuParams) => {
    try {
        const queries: string[] = [];
        if (category) queries.push(Query.equal('categories', category));

        if (query) queries.push(Query.search('name', query));

        const menu = await databases.listDocuments(
            appwriteConfig.databaseId,
            appwriteConfig.menuCollectionId,
            queries
        );
        return menu.documents;
    } catch (e) {

        throw new Error(e as string);
    }
}

export const getCategories = async () => {
    try {
        const categories = await databases.listDocuments(
            appwriteConfig.databaseId,
            appwriteConfig.categoriesCollectionId
        );
        return categories.documents;
    } catch (e) {
        throw new Error(e as string);
    }
}




// ✅ Create Payment Intent
export const createPaymentIntent = async ({
    amount,
    currency = "usd",
    userId,
    items,
}: {
    amount: number;
    currency?: string;
    userId: string;
    items: any[];
}) => {
    try {
        const execution = await functions.createExecution(
            appwriteConfig.createPaymentIntentFnId,
            JSON.stringify({ amount, currency, userId, items }),
            false // async? false = wait for response
        );

        const res = JSON.parse(execution.responseBody);
        if (!res.clientSecret) throw new Error("Failed to create payment intent");
        return res.clientSecret;
    } catch (e) {
        console.error("createPaymentIntent error:", e);
        throw e;
    }
};

// ✅ Optional: Get all payments for a user
export const getPayments = async (userId: string) => {
    try {
        const payments = await databases.listDocuments(
            appwriteConfig.databaseId,
            appwriteConfig.paymentsCollectionId,
            [Query.equal("userId", userId)]
        );
        return payments.documents;
    } catch (e) {
        console.error("getPayments error:", e);
        throw e;
    }
};
