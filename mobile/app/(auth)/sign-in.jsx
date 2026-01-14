import { useSignIn } from "@clerk/clerk-expo";
import { useRouter } from "expo-router";
import { View, Text, Alert, KeyboardAvoidingView, ScrollView, Platform, TextInput, TouchableOpacity } from "react-native";
import { useState } from "react";

import { authStyles } from "../../assets/styles/auth.styles";
import {Image} from 'expo-image';
import { Ionicons } from "@expo/vector-icons";
import { COLORS } from "../../constants/colors";

const SignInScreen = () => {
const router = useRouter();

const {signIn, setActive, isLoaded} = useSignIn();

const [email, setEmail] = useState("");
const [password, setPassword] = useState("");
const [showPssword, setShowPassword] = useState(false);
const [loading, setLoading] = useState(false);

const handleSignIn = async () => {
  if (!email || !password) {
    Alert.alert("Error","Please enter both email and password.");
    return;
  }
  if (!isLoaded) return;
  setLoading(true);
  try {
    const signInAttempt = await signIn.create({identifier: email, password: password});
    if (signInAttempt.status === "complete") {
      await setActive({session: signInAttempt.createdSessionId});
    //  router.replace("/");
    } else{
      Alert.alert("Error","Sign-in not complete. Please try again.");
      console.error(JSON.stringify(signInAttempt, null, 2));
    }
  } catch (err) {
    Alert.alert("Error", err.errors?.[0]?.message || "Sign In failed");
    console.error(JSON.stringify(err, null, 2));
  } finally {
    setLoading(false);
  }
}
  return (
    <View style={authStyles.container}>  
    <KeyboardAvoidingView style={authStyles.keyboardView} behavior={Platform.OS === 'ios' ? 'padding' : 'height'} keyboardVerticalOffset={Platform.OS === 'ios' ? 64 : 0}>
      <ScrollView contentContainerStyle={authStyles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={authStyles.imageContainer}>
        <Image
          source={require('../../assets/images/i1.png')}
          style={authStyles.image}
          contentFit="contain"
        />
      </View>
      <Text style={authStyles.title}>Welcome Back</Text>

      {/* Form Container */ }
      <View style={authStyles.formContainer}>

        {/* Email Input Field */ }
      <View style={authStyles.inputContainer}>
      <TextInput
        style={authStyles.textInput}
        placeholder="Enter Email"
        placeholderTextColor={COLORS.textLight}
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      
        />
        </View>
        {/* Password Input Field */ }
        <View style={authStyles.inputContainer}>
          <TextInput
            style={authStyles.textInput}
            placeholder="Enter Password"
            placeholderTextColor={COLORS.textLight}
            value={password}
            onChangeText={setPassword}
            secureTextEntry={!showPssword}
            autoCapitalize="none"
          />
          <TouchableOpacity style={authStyles.eyeButton} onPress={() => setShowPassword(!showPssword)}>
<Ionicons 
name={showPssword? "eye-outline" : "eye-off-outline"}
size={20}
color={COLORS.textLight}
/>
          </TouchableOpacity>
          </View>
          <TouchableOpacity 
          style ={[authStyles.authButton, loading&& authStyles.buttonDisabled]}
          onPress={handleSignIn}
          disabled={loading}
          activeOpacity={0.8}>
           <Text style={authStyles.buttonText}>
            {loading ? "Signing In..." : "Sign In"}
          </Text>
          </TouchableOpacity>

        {/* Sign Up Link */}
      <TouchableOpacity style ={authStyles.linkContainer}
      onPress={()=>router.push("/(auth)/sign-up")}>
      <Text style={authStyles.linkText}> Don&apos;t have an account? <Text style={authStyles.link}>Sign Up</Text></Text>
      </TouchableOpacity>
        </View>
      </ScrollView>
      </KeyboardAvoidingView >
    </View>
  )
}
export default SignInScreen;