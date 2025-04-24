import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Briefcase, FileText } from 'lucide-react';
import { serviceAPI } from '../../services/api';

const skillOptions = [
  'React', 'Node.js', 'JavaScript', 'TypeScript', 'Python', 
  'Java', 'C#', 'PHP', 'Ruby', 'Go', 'Swift', 'Kotlin',
  'UI/UX', 'Graphic Design', 'Content Writing', 'SEO', 
  'Digital Marketing', 'Data Analysis', 'Machine Learning'
];

const serviceRequestSchema = z.object({
  serviceDetails: z.string().min(10, 'Service details must be at least 10 characters'),
  skillsRequired: z.array(z.string()).min(1, 'Select at least one required skill'),
});

type ServiceRequestFormValues = z.infer<typeof serviceRequestSchema>;

const ServiceRequestForm: React.FC = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
    watch,
  } = useForm<ServiceRequestFormValues>({
    resolver: zodResolver(serviceRequestSchema),
    defaultValues: {
      skillsRequired: [],
    },
  });

  const watchSkills = watch('skillsRequired');

  const onSubmit = async (data: ServiceRequestFormValues) => {
    try {
      setIsSubmitting(true);
      setErrorMessage('');
      setSuccessMessage('');
      
      await serviceAPI.createRequest(data);
      
      setSuccessMessage('Service request created successfully!');
      reset();
    } catch (error) {
      console.error('Service request creation error:', error);
      setErrorMessage('Failed to create service request. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full max-w-2xl p-8 space-y-8 bg-white rounded-lg shadow-md">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-gray-900">Create Service Request</h1>
        <p className="mt-2 text-gray-600">Describe the service you need from other freelancers</p>
      </div>
      
      {successMessage && (
        <div className="p-4 bg-green-50 border-l-4 border-green-500 rounded-md">
          <p className="text-sm text-green-700">{successMessage}</p>
        </div>
      )}
      
      {errorMessage && (
        <div className="p-4 bg-red-50 border-l-4 border-red-500 rounded-md">
          <p className="text-sm text-red-700">{errorMessage}</p>
        </div>
      )}
      
      <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-6">
        <div>
          <label htmlFor="serviceDetails" className="block text-sm font-medium text-gray-700">
            Service Details
          </label>
          <div className="mt-1 relative rounded-md shadow-sm">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FileText className="h-5 w-5 text-gray-400" />
            </div>
            <textarea
              id="serviceDetails"
              {...register('serviceDetails')}
              rows={4}
              className="pl-10 block w-full rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              placeholder="Describe the service you need in detail..."
            />
          </div>
          {errors.serviceDetails && (
            <p className="mt-1 text-sm text-red-600">{errors.serviceDetails.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="skillsRequired" className="block text-sm font-medium text-gray-700">
            Required Skills
          </label>
          <div className="mt-1 relative rounded-md shadow-sm">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Briefcase className="h-5 w-5 text-gray-400" />
            </div>
            <select
              id="skillsRequired"
              multiple
              {...register('skillsRequired')}
              className="pl-10 block w-full rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              size={5}
            >
              {skillOptions.map((skill) => (
                <option key={skill} value={skill}>
                  {skill}
                </option>
              ))}
            </select>
          </div>
          <p className="mt-1 text-sm text-gray-500">
            Selected: {watchSkills?.join(', ') || 'None'}
          </p>
          {errors.skillsRequired && (
            <p className="mt-1 text-sm text-red-600">{errors.skillsRequired.message}</p>
          )}
        </div>

        <div>
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
          >
            {isSubmitting ? 'Creating...' : 'Create Service Request'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ServiceRequestForm;