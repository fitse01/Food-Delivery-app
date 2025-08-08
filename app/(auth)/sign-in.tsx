import CustomButton from "@/components/CustomButton";
import CustomInput from "@/components/CustomInput";
import { signIn } from "@/lib/appwrite";
import * as Sentry from "@sentry/react-native";
import { Link, router } from "expo-router";
import React, { useState } from "react";
import { Alert, Button, Text, View } from "react-native";
const SignIn = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [Form, setForm] = useState({
    email: "",
    password: "",
  });

  const submit = async () => {
    const { email, password } = Form;

    if (!email || !password)
      return Alert.alert("Error ", "Please Enter a valid Email and Password");

    setIsSubmitting(true);

    try {
      // Simulate a sign-in process using appwrite
      await signIn({ email, password });
      Alert.alert("Success", "User signed in successfully!");
      // Redirect to home or dashboard after successful sign-in
      router.replace("/");
    } catch (error: any) {
      Alert.alert("Error", error.message || "An error occurred during sign-in");
      Sentry.captureException(error);
    } finally {
      setIsSubmitting(false);
    }
  };
  return (
    <View className="gap-10 bg-white rounded-lg p-5 mt-5">
      <CustomInput
        placeholder="Enter Your Email "
        value={Form.email}
        onChangeText={(text) => setForm((prev) => ({ ...prev, email: text }))}
        label="Email"
        keyboardType="email-address"
      />
      <CustomInput
        placeholder="Enter Your Password "
        value={Form.password}
        onChangeText={(text) =>
          setForm((prev) => ({ ...prev, password: text }))
        }
        label="Password"
        secureTextEntry={true}
      />
      <CustomButton title="Sign In" isLoading={isSubmitting} onPress={submit} />

      <View className=" flex justify-center gap-2 mt-5 flex-row">
        <Text className="base-regular text-gray-100">
          Dont have an account ?{" "}
        </Text>
        <Link href="/sign-up" className="base-bold text-primary">
          Sign Up{" "}
        </Link>
      </View>

      <Button
        title="Try!"
        onPress={() => {
          Sentry.captureException(new Error("First error"));
        }}
      />
    </View>
  );
};

export default SignIn;
