// import React, { useState } from 'react';
// import { useForm } from 'react-hook-form';
// import { zodResolver } from '@hookform/resolvers/zod';
// import { z } from 'zod';
// import { useAuth } from '../../context/AuthContext';
// import { User, Mail, Lock, Briefcase, Award } from 'lucide-react';

// const skillOptions = [
//   'React', 'Node.js', 'JavaScript', 'TypeScript', 'Python', 
//   'Java', 'C#', 'PHP', 'Ruby', 'Go', 'Swift', 'Kotlin',
//   'UI/UX', 'Graphic Design', 'Content Writing', 'SEO', 
//   'Digital Marketing', 'Data Analysis', 'Machine Learning'
// ];

// const expertiseLevels = ['Beginner', 'Intermediate', 'Expert'];

// const registerSchema = z.object({
//   name: z.string().min(2, 'Name must be at least 2 characters'),
//   email: z.string().email('Invalid email address'),
//   password: z.string().min(8, 'Password must be at least 8 characters'),
//   skills: z.array(z.string()).min(1, 'Select at least one skill'),
//   expertiseLevel: z.string().min(1, 'Please select your expertise level'),
// });

// type RegisterFormValues = z.infer<typeof registerSchema>;

// const RegisterForm: React.FC = () => {
//   const { register: registerUser } = useAuth();
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const [registrationComplete, setRegistrationComplete] = useState(false);
//   const [email, setEmail] = useState('');

//   const {
//     register,
//     handleSubmit,
//     formState: { errors },
//     watch,
//   } = useForm<RegisterFormValues>({
//     resolver: zodResolver(registerSchema),
//     defaultValues: {
//       skills: [],
//     },
//   });

//   const onSubmit = async (data: RegisterFormValues) => {
//     try {
//       setIsSubmitting(true);
//       await registerUser(data);
//       setEmail(data.email);
//       setRegistrationComplete(true);
//     } catch (error) {
//       console.error('Registration error:', error);
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   const watchSkills = watch('skills');

//   if (registrationComplete) {
//     return <OtpVerificationForm email={email} />;
//   }

//   return (
//     <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
//       <div className="text-center">
//         <h1 className="text-2xl font-bold text-gray-900">Create an Account</h1>
//         <p className="mt-2 text-gray-600">Join our freelancer skill exchange platform</p>
//       </div>
      
//       <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-6">
//         <div>
//           <label htmlFor="name" className="block text-sm font-medium text-gray-700">
//             Full Name
//           </label>
//           <div className="mt-1 relative rounded-md shadow-sm">
//             <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//               <User className="h-5 w-5 text-gray-400" />
//             </div>
//             <input
//               id="name"
//               type="text"
//               {...register('name')}
//               className="pl-10 block w-full rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
//               placeholder="John Doe"
//             />
//           </div>
//           {errors.name && (
//             <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
//           )}
//         </div>

//         <div>
//           <label htmlFor="email" className="block text-sm font-medium text-gray-700">
//             Email Address
//           </label>
//           <div className="mt-1 relative rounded-md shadow-sm">
//             <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//               <Mail className="h-5 w-5 text-gray-400" />
//             </div>
//             <input
//               id="email"
//               type="email"
//               {...register('email')}
//               className="pl-10 block w-full rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
//               placeholder="you@example.com"
//             />
//           </div>
//           {errors.email && (
//             <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
//           )}
//         </div>

//         <div>
//           <label htmlFor="password" className="block text-sm font-medium text-gray-700">
//             Password
//           </label>
//           <div className="mt-1 relative rounded-md shadow-sm">
//             <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//               <Lock className="h-5 w-5 text-gray-400" />
//             </div>
//             <input
//               id="password"
//               type="password"
//               {...register('password')}
//               className="pl-10 block w-full rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
//               placeholder="********"
//             />
//           </div>
//           {errors.password && (
//             <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>
//           )}
//         </div>

//         <div>
//           <label htmlFor="skills" className="block text-sm font-medium text-gray-700">
//             Skills
//           </label>
//           <div className="mt-1 relative rounded-md shadow-sm">
//             <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//               <Briefcase className="h-5 w-5 text-gray-400" />
//             </div>
//             <select
//               id="skills"
//               multiple
//               {...register('skills')}
//               className="pl-10 block w-full rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
//               size={3}
//             >
//               {skillOptions.map((skill) => (
//                 <option key={skill} value={skill}>
//                   {skill}
//                 </option>
//               ))}
//             </select>
//           </div>
//           <p className="mt-1 text-sm text-gray-500">
//             Selected: {watchSkills?.join(', ') || 'None'}
//           </p>
//           {errors.skills && (
//             <p className="mt-1 text-sm text-red-600">{errors.skills.message}</p>
//           )}
//         </div>

//         <div>
//           <label htmlFor="expertiseLevel" className="block text-sm font-medium text-gray-700">
//             Expertise Level
//           </label>
//           <div className="mt-1 relative rounded-md shadow-sm">
//             <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//               <Award className="h-5 w-5 text-gray-400" />
//             </div>
//             <select
//               id="expertiseLevel"
//               {...register('expertiseLevel')}
//               className="pl-10 block w-full rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
//             >
//               <option value="">Select your expertise level</option>
//               {expertiseLevels.map((level) => (
//                 <option key={level} value={level}>
//                   {level}
//                 </option>
//               ))}
//             </select>
//           </div>
//           {errors.expertiseLevel && (
//             <p className="mt-1 text-sm text-red-600">{errors.expertiseLevel.message}</p>
//           )}
//         </div>

//         <div>
//           <button
//             type="submit"
//             disabled={isSubmitting}
//             className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
//           >
//             {isSubmitting ? 'Registering...' : 'Register'}
//           </button>
//         </div>
//       </form>
//     </div>
//   );
// };

// interface OtpVerificationFormProps {
//   email: string;
// }

// const OtpVerificationForm: React.FC<OtpVerificationFormProps> = ({ email }) => {
//   const { verifyOtp } = useAuth();
//   const [otp, setOtp] = useState('');
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const [error, setError] = useState('');

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     if (!otp) {
//       setError('Please enter the OTP');
//       return;
//     }

//     try {
//       setIsSubmitting(true);
//       setError('');
//       await verifyOtp(email, otp);
//       // Redirect happens automatically via AuthContext
//     } catch (error) {
//       console.error('OTP verification error:', error);
//       setError('Invalid OTP. Please try again.');
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   return (
//     <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
//       <div className="text-center">
//         <h1 className="text-2xl font-bold text-gray-900">Verify Your Email</h1>
//         <p className="mt-2 text-gray-600">
//           We've sent a verification code to {email}
//         </p>
//       </div>

//       <form onSubmit={handleSubmit} className="mt-8 space-y-6">
//         <div>
//           <label htmlFor="otp" className="block text-sm font-medium text-gray-700">
//             Verification Code
//           </label>
//           <input
//             id="otp"
//             type="text"
//             value={otp}
//             onChange={(e) => setOtp(e.target.value)}
//             className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
//             placeholder="Enter 6-digit code"
//           />
//           {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
//         </div>

//         <div>
//           <button
//             type="submit"
//             disabled={isSubmitting}
//             className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
//           >
//             {isSubmitting ? 'Verifying...' : 'Verify OTP'}
//           </button>
//         </div>
//       </form>
//     </div>
//   );
// };

// export default RegisterForm;



import React, { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuth } from '../../context/AuthContext';
import { 
  User, 
  Mail, 
  Lock, 
  Briefcase, 
  Award, 
  CheckCircle2, 
  XCircle 
} from 'lucide-react';
import { Navigate, useNavigate } from 'react-router-dom';

// Skill and expertise level configuration
const skillOptions = [
  'React', 'Node.js', 'JavaScript', 'TypeScript', 'Python', 
  'Java', 'C#', 'PHP', 'Ruby', 'Go', 'Swift', 'Kotlin',
  'UI/UX', 'Graphic Design', 'Content Writing', 'SEO', 
  'Digital Marketing', 'Data Analysis', 'Machine Learning'
];

const expertiseLevels = ['Beginner', 'Intermediate', 'Expert'];

// Validation schema
const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number'),
  skills: z.array(z.string()).min(1, 'Select at least one skill'),
  expertiseLevel: z.string().min(1, 'Please select your expertise level'),
});

type RegisterFormValues = z.infer<typeof registerSchema>;

const RegisterForm: React.FC = () => {
  const { register: registerUser } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [registrationComplete, setRegistrationComplete] = useState(false);
  const [email, setEmail] = useState('');

  const {
    control,
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      skills: [],
    },
  });

  const onSubmit = async (data: RegisterFormValues) => {
    try {
      setIsSubmitting(true);
      await registerUser(data);
      setEmail(data.email);
      setRegistrationComplete(true);
    } catch (error) {
      console.error('Registration error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const watchSkills = watch('skills');

  if (registrationComplete) {
    return <OtpVerificationForm email={email} />;
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow-xl rounded-2xl sm:px-10">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-extrabold text-gray-900">
              Create Your Account
            </h1>
            <p className="mt-2 text-sm text-gray-600">
              Join our freelancer skill exchange platform
            </p>
          </div>
          
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Name Input */}
            <div>
              <div className="relative">
                <input
                  id="name"
                  type="text"
                  {...register('name')}
                  placeholder="Full Name"
                  className="peer block w-full appearance-none border-b-2 border-gray-300 bg-transparent py-2.5 pl-10 text-sm text-gray-900 focus:border-indigo-600 focus:outline-none"
                />
                <User className="absolute left-0 top-3 h-5 w-5 text-gray-400 peer-focus:text-indigo-600" />
              </div>
              {errors.name && (
                <p className="mt-1 text-sm text-red-600 flex items-center">
                  <XCircle className="mr-1 h-4 w-4" /> {errors.name.message}
                </p>
              )}
            </div>

            {/* Email Input */}
            <div>
              <div className="relative">
                <input
                  id="email"
                  type="email"
                  {...register('email')}
                  placeholder="Email Address"
                  className="peer block w-full appearance-none border-b-2 border-gray-300 bg-transparent py-2.5 pl-10 text-sm text-gray-900 focus:border-indigo-600 focus:outline-none"
                />
                <Mail className="absolute left-0 top-3 h-5 w-5 text-gray-400 peer-focus:text-indigo-600" />
              </div>
              {errors.email && (
                <p className="mt-1 text-sm text-red-600 flex items-center">
                  <XCircle className="mr-1 h-4 w-4" /> {errors.email.message}
                </p>
              )}
            </div>

            {/* Password Input */}
            <div>
              <div className="relative">
                <input
                  id="password"
                  type="password"
                  {...register('password')}
                  placeholder="Password"
                  className="peer block w-full appearance-none border-b-2 border-gray-300 bg-transparent py-2.5 pl-10 text-sm text-gray-900 focus:border-indigo-600 focus:outline-none"
                />
                <Lock className="absolute left-0 top-3 h-5 w-5 text-gray-400 peer-focus:text-indigo-600" />
              </div>
              {errors.password && (
                <p className="mt-1 text-sm text-red-600 flex items-center">
                  <XCircle className="mr-1 h-4 w-4" /> {errors.password.message}
                </p>
              )}
            </div>

            {/* Skills Multiselect */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select Your Skills
              </label>
              <Controller
                name="skills"
                control={control}
                render={({ field }) => (
                  <div className="grid grid-cols-3 gap-2">
                    {skillOptions.map((skill) => (
                      <label 
                        key={skill} 
                        className={`flex items-center p-2 rounded-lg cursor-pointer transition-all 
                          ${field.value.includes(skill) 
                            ? 'bg-indigo-100 border-indigo-500 text-indigo-700' 
                            : 'bg-gray-100 border-transparent text-gray-700 hover:bg-gray-200'}`}
                      >
                        <input
                          type="checkbox"
                          value={skill}
                          checked={field.value.includes(skill)}
                          onChange={(e) => {
                            const newSkills = e.target.checked 
                              ? [...field.value, skill]
                              : field.value.filter((s) => s !== skill);
                            field.onChange(newSkills);
                          }}
                          className="hidden"
                        />
                        <span className="ml-2">{skill}</span>
                      </label>
                    ))}
                  </div>
                )}
              />
              {errors.skills && (
                <p className="mt-1 text-sm text-red-600 flex items-center">
                  <XCircle className="mr-1 h-4 w-4" /> {errors.skills.message}
                </p>
              )}
            </div>

            {/* Expertise Level */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Expertise Level
              </label>
              <div className="flex space-x-4">
                {expertiseLevels.map((level) => (
                  <label 
                    key={level} 
                    className={`flex-1 text-center p-3 rounded-lg cursor-pointer transition-all 
                      ${watch('expertiseLevel') === level 
                        ? 'bg-indigo-100 border-2 border-indigo-500 text-indigo-700' 
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                  >
                    <input
                      type="radio"
                      value={level}
                      {...register('expertiseLevel')}
                      className="hidden"
                    />
                    {level}
                  </label>
                ))}
              </div>
              {errors.expertiseLevel && (
                <p className="mt-1 text-sm text-red-600 flex items-center">
                  <XCircle className="mr-1 h-4 w-4" /> {errors.expertiseLevel.message}
                </p>
              )}
            </div>

            {/* Submit Button */}
            <div>
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 transition-all"
              >
                {isSubmitting ? 'Registering...' : 'Create Account'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

// OTP Verification Form
interface OtpVerificationFormProps {
  email: string;
}

const OtpVerificationForm: React.FC<OtpVerificationFormProps> = ({ email }) => {
  const { verifyOtp } = useAuth();
  const [otp, setOtp] = useState('');
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!otp) {
      setError('Please enter the OTP');
      return;
    }
    console.log(otp);

    try {
      setIsSubmitting(true);
      setError('');
      await verifyOtp(email, otp,navigate);
      navigate('/login');
    } catch (error) {
      console.error('OTP verification error:', error);
      setError('Invalid OTP. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow-xl rounded-2xl sm:px-10">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-extrabold text-gray-900">
              Verify Your Email
            </h1>
            <p className="mt-2 text-sm text-gray-600">
              Enter the 6-digit code sent to {email}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="relative">
              <input
                id="otp"
                type="text"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                placeholder="Enter 6-digit verification code"
                className="block w-full appearance-none border-b-2 border-gray-300 bg-transparent py-2.5 text-center text-2xl tracking-[0.5em] text-gray-900 focus:border-indigo-600 focus:outline-none"
                maxLength={6}
              />
            </div>

            {error && (
              <p className="text-center text-sm text-red-600 flex items-center justify-center">
                <XCircle className="mr-2 h-5 w-5" /> {error}
              </p>
            )}

            <div>
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 transition-all"
              >
                {isSubmitting ? 'Verifying...' : 'Verify Code'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default RegisterForm;