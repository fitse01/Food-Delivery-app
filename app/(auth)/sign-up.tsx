import CustomButton from "@/components/CustomButton";
import CustomInput from "@/components/CustomInput";
import { createUser } from "@/lib/appwrite";
import { Link, router } from "expo-router";
import React, { useState } from "react";
import { Alert, Text, View } from "react-native";

const SignUp = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [Form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });

  const submit = async () => {
    const { name, email, password } = Form;

    if (!name || !email || !password)
      return Alert.alert(
        "Error ",
        "Please Enter a valid Name, Email and Password"
      );

    setIsSubmitting(true);

    try {
      // call the createUser function from appwrite to register the user
      await createUser({ email, password, name });

      // Alert.alert("Success", "User signed Up successfully!");
      // Redirect to home or dashboard after successful sign-in
      router.replace("/");
    } catch (error: any) {
      Alert.alert("Error", error.message || "An error occurred during sign-Up");
    } finally {
      setIsSubmitting(false);
    }
  };
  return (
    <View className="gap-10 bg-white rounded-lg p-5 mt-5">
      <CustomInput
        placeholder="Enter Your Full Name "
        value={Form.name}
        onChangeText={(text) => setForm((prev) => ({ ...prev, name: text }))}
        label="Full Name"
      />
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
      <CustomButton title="Sign Up" isLoading={isSubmitting} onPress={submit} />

      <View className=" flex justify-center gap-2 mt-5 flex-row">
        <Text className="base-regular text-gray-100">
          Already have an account ?{" "}
        </Text>
        <Link href="/sign-in" className="base-bold text-primary">
          Sign In{" "}
        </Link>
      </View>
    </View>
  );
};

export default SignUp;
