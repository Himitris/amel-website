import { 
    createUserWithEmailAndPassword, 
    signInWithEmailAndPassword, 
    signOut, 
    sendPasswordResetEmail,
    User,
    onAuthStateChanged,
    updateProfile
  } from 'firebase/auth';
  import { auth } from './config';
  
  export const authService = {
    // Register a new user
    async register(email: string, password: string, displayName: string): Promise<User> {
      try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        // Update the user's display name
        if (userCredential.user) {
          await updateProfile(userCredential.user, { displayName });
        }
        return userCredential.user;
      } catch (error) {
        console.error('Error registering user:', error);
        throw error;
      }
    },
  
    // Login a user
    async login(email: string, password: string): Promise<User> {
      try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        return userCredential.user;
      } catch (error) {
        console.error('Error logging in:', error);
        throw error;
      }
    },
  
    // Logout a user
    async logout(): Promise<void> {
      try {
        await signOut(auth);
      } catch (error) {
        console.error('Error logging out:', error);
        throw error;
      }
    },
  
    // Send password reset email
    async sendPasswordResetEmail(email: string): Promise<void> {
      try {
        await sendPasswordResetEmail(auth, email);
      } catch (error) {
        console.error('Error sending password reset email:', error);
        throw error;
      }
    },
  
    // Get the current user
    getCurrentUser(): User | null {
      return auth.currentUser;
    },
  
    // Subscribe to auth state changes
    onAuthStateChanged(callback: (user: User | null) => void): () => void {
      return onAuthStateChanged(auth, callback);
    }
  };
  
  export default authService;