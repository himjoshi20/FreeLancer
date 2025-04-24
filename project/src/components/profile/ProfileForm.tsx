import React, { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuth } from '../../hooks/useAuth';
import { User, Briefcase, Award, Upload, Check } from 'lucide-react';
import { userAPI } from '../../services/api';

const skillOptions = [
  'React', 'Node.js', 'JavaScript', 'TypeScript', 'Python', 
  'Java', 'C#', 'PHP', 'Ruby', 'Go', 'Swift', 'Kotlin',
  'UI/UX', 'Graphic Design', 'Content Writing', 'SEO', 
  'Digital Marketing', 'Data Analysis', 'Machine Learning'
];

const expertiseLevels = ['Beginner', 'Intermediate', 'Expert'];

const profileSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  skills: z.array(z.string()).min(1, 'Select at least one skill'),
  expertiseLevel: z.string().min(1, 'Please select your expertise level'),
});

type ProfileFormValues = z.infer<typeof profileSchema>;

const ProfileForm: React.FC = () => {
  const { user, updateProfile } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [uploadStatus, setUploadStatus] = useState('');
  const [portfolioFiles, setPortfolioFiles] = useState<string[]>(user?.portfolio || []);
  const [searchSkill, setSearchSkill] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
    watch,
  } = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: user?.name || '',
      skills: user?.skills || [],
      expertiseLevel: user?.expertiseLevel || '',
    },
  });

  const watchSkills = watch('skills');

  const onSubmit = async (data: ProfileFormValues) => {
    try {
      setIsSubmitting(true);
      setErrorMessage('');
      setSuccessMessage('');
      
      await updateProfile(data);
      
      setSuccessMessage('Profile updated successfully!');
    } catch (error) {
      console.error('Profile update error:', error);
      setErrorMessage('Failed to update profile. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const file = files[0];
    
    try {
      setUploadStatus('Uploading...');
      const response = await userAPI.uploadPortfolio(file);
      
      setPortfolioFiles((prev) => [...prev, response.data.fileUrl]);
      setUploadStatus('Upload successful!');
      
      // Clear the input
      e.target.value = '';
      
      setTimeout(() => {
        setUploadStatus('');
      }, 3000);
    } catch (error) {
      console.error('File upload error:', error);
      setUploadStatus('Upload failed. Please try again.');
    }
  };

  // Filter skills based on search
  const filteredSkills = skillOptions.filter(skill => 
    skill.toLowerCase().includes(searchSkill.toLowerCase())
  );

  return (
    <div className="w-full max-w-3xl p-8 space-y-8 bg-white rounded-2xl shadow-soft border border-gray-100">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900">Your Profile</h1>
        <p className="mt-2 text-gray-600">Update your information and portfolio</p>
      </div>
      
      {successMessage && (
        <div className="p-4 bg-green-50 border-l-4 border-green-500 rounded-md animate-pulse">
          <p className="text-sm text-green-700">{successMessage}</p>
        </div>
      )}
      
      {errorMessage && (
        <div className="p-4 bg-red-50 border-l-4 border-red-500 rounded-md animate-pulse">
          <p className="text-sm text-red-700">{errorMessage}</p>
        </div>
      )}
      
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700">
            Full Name
          </label>
          <div className="mt-1 relative rounded-md shadow-sm">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <User className="h-5 w-5 text-gray-400" />
            </div>
            <input
              id="name"
              type="text"
              {...register('name')}
              className="pl-10 block w-full rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
          </div>
          {errors.name && (
            <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="skills" className="block text-sm font-medium text-gray-700">
            Skills
          </label>
          <div className="mt-1 relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Briefcase className="h-5 w-5 text-gray-400" />
            </div>
            <input 
              type="text" 
              placeholder="Search skills"
              value={searchSkill}
              onChange={(e) => setSearchSkill(e.target.value)}
              className="pl-10 block w-full rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm mb-2"
            />
            <Controller
              name="skills"
              control={control}
              render={({ field }) => (
                <div className="grid grid-cols-3 gap-2 max-h-60 overflow-y-auto border rounded-md p-2">
                  {filteredSkills.map((skill) => (
                    <label 
                      key={skill} 
                      className={`flex items-center space-x-2 p-2 rounded-md cursor-pointer transition-colors ${
                        field.value.includes(skill) 
                          ? 'bg-indigo-50 border border-indigo-500' 
                          : 'hover:bg-gray-50'
                      }`}
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
                      {field.value.includes(skill) ? (
                        <Check className="h-5 w-5 text-indigo-600" />
                      ) : (
                        <div className="h-5 w-5 border rounded border-gray-300" />
                      )}
                      <span className="text-sm">{skill}</span>
                    </label>
                  ))}
                </div>
              )}
            />
          </div>
          <p className="mt-1 text-sm text-gray-500">
            Selected: {watchSkills?.join(', ') || 'None'}
          </p>
          {errors.skills && (
            <p className="mt-1 text-sm text-red-600">{errors.skills.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="expertiseLevel" className="block text-sm font-medium text-gray-700">
            Expertise Level
          </label>
          <div className="mt-1 relative rounded-md shadow-sm">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Award className="h-5 w-5 text-gray-400" />
            </div>
            <select
              id="expertiseLevel"
              {...register('expertiseLevel')}
              className="pl-10 block w-full rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            >
              <option value="">Select your expertise level</option>
              {expertiseLevels.map((level) => (
                <option key={level} value={level}>
                  {level}
                </option>
              ))}
            </select>
          </div>
          {errors.expertiseLevel && (
            <p className="mt-1 text-sm text-red-600">{errors.expertiseLevel.message}</p>
          )}
        </div>

        <div>
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 transition-all duration-300 transform hover:scale-[1.02]"
          >
            {isSubmitting ? 'Updating...' : 'Update Profile'}
          </button>
        </div>
      </form>

      <div className="border-t border-gray-200 pt-6">
        <h2 className="text-lg font-medium text-gray-900">Portfolio</h2>
        
        <div className="mt-4">
          <label className="block text-sm font-medium text-gray-700">
            Upload Portfolio Files
          </label>
          <div className="mt-1 flex items-center">
            <label htmlFor="file-upload" className="cursor-pointer bg-white py-2 px-3 border border-gray-300 rounded-md shadow-sm text-sm leading-4 font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
              <Upload className="h-5 w-5 inline-block mr-2" />
              Choose File
            </label>
            <input
              id="file-upload"
              name="file-upload"
              type="file"
              className="sr-only"
              onChange={handleFileUpload}
            />
            <span className="ml-3 text-sm text-gray-500">
              {uploadStatus || 'PDF, DOC, JPG, PNG up to 10MB'}
            </span>
          </div>
        </div>

        {portfolioFiles.length > 0 && (
          <div className="mt-4">
            <h3 className="text-sm font-medium text-gray-700">Your Portfolio Files</h3>
            <ul className="mt-2 border border-gray-200 rounded-md divide-y divide-gray-200">
              {portfolioFiles.map((file, index) => (
                <li key={index} className="pl-3 pr-4 py-3 flex items-center justify-between text-sm">
                  <div className="w-0 flex-1 flex items-center">
                    <span className="ml-2 flex-1 w-0 truncate">
                      {file.split('/').pop()}
                    </span>
                  </div>
                  <div className="ml-4 flex-shrink-0">
                    <a
                      href={file}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-medium text-indigo-600 hover:text-indigo-500"
                    >
                      View
                    </a>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfileForm;