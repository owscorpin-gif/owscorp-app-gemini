import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import ServiceCard from '../components/ServiceCard';
import type { Service, Review, ToastType } from '../types';
import ServiceQuickViewModal from '../components/ServiceQuickViewModal';
import type { Session } from '@supabase/supabase-js';
import StarRatingDisplay from '../components/StarRatingDisplay';
import StarRatingInput from '../components/StarRatingInput';
import Pagination from '../components/Pagination';
import { supabase } from '../supabaseClient';
import { services as mockServices } from '../data/services';

interface DeveloperProfilePageProps {
  developerId: string;
  developerName: string;
  onNavigate: (page: string, params?: any) => void;
  onAddToCart: (service: Service) => void;
  session: Session | null;
  showToast: (message: string, type: ToastType) => void;
}

const SERVICES_PER_PAGE = 9;

const DeveloperProfilePage: React.FC<DeveloperProfilePageProps> = ({ developerId, developerName, onNavigate, onAddToCart, session, showToast }) => {
  const bioTextareaRef = useRef<HTMLTextAreaElement>(null);
  const [selectedService, setSelectedService] = useState<Service | null>(null);

  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [developerServices, setDeveloperServices] = useState<Service[]>([]);
  const [averageRating, setAverageRating] = useState<number>(0);
  const [userRating, setUserRating] = useState(0);
  const [userComment, setUserComment] = useState('');
  const [reviewError, setReviewError] = useState('');

  const defaultBio = useMemo(() => `This is a placeholder for the developer's biography. Here, ${developerName} would describe their expertise, experience, and the types of solutions they specialize in. They might also include links to their portfolio or personal website.`, [developerName]);

  const [bio, setBio] = useState<string>(defaultBio);
  const [isEditingBio, setIsEditingBio] = useState(false);

  const fetchReviews = useCallback(async () => {
      const { data, error } = await supabase
          .from('reviews')
          .select('*')
          .eq('developer_id', developerId)
          .order('created_at', { ascending: false });

      if (error) {
          showToast('Could not fetch reviews.', 'error');
          console.warn('Error fetching reviews:', error.message);
          setReviews([]);
      } else {
          setReviews(data);
          if (data.length > 0) {
              const totalRating = data.reduce((sum, review) => sum + review.rating, 0);
              setAverageRating(totalRating / data.length);
          } else {
              setAverageRating(0);
          }
      }
  }, [developerId, showToast]);


  useEffect(() => {
    const fetchData = async () => {
        setIsLoading(true);
        // Fetch profile, services, and reviews concurrently
        const [profileResult, servicesResult] = await Promise.all([
             supabase.from('profiles').select('description').eq('id', developerId).single(),
             supabase.from('services').select('*').eq('developer_id', developerId)
        ]);
        
        const { data: profileData, error: profileError } = profileResult;
        if (profileError && profileError.code !== 'PGRST116') {
            showToast(profileError.message, 'error');
        } else {
            setBio(profileData?.description || defaultBio);
        }

        const { data: servicesData, error: servicesError } = servicesResult;
         if (servicesError) {
            showToast('Could not fetch services, showing demo data.', 'error');
            console.warn('Error fetching developer services, falling back to mock data:', servicesError.message);
            const devServices = mockServices.filter(s => s.developer_id === developerId);
            setDeveloperServices(devServices);
        } else {
            setDeveloperServices(servicesData as Service[]);
        }

        await fetchReviews();
        setIsLoading(false);
    };
    fetchData();
  }, [developerId, showToast, defaultBio, fetchReviews]);
  
  const totalPages = Math.ceil(developerServices.length / SERVICES_PER_PAGE);
  const paginatedServices = developerServices.slice(
    (currentPage - 1) * SERVICES_PER_PAGE,
    currentPage * SERVICES_PER_PAGE
  );

  const isVerified = developerServices.length > 0 ? developerServices[0].developerVerified : false;

  const handleEditBioClick = () => {
    if (session?.user?.id !== developerId) {
        showToast("You can only edit your own profile.", "error");
        return;
    }
    setIsEditingBio(true);
    setTimeout(() => bioTextareaRef.current?.focus(), 0);
  };

  const handleSaveBioClick = async () => {
    const { error } = await supabase
        .from('profiles')
        .update({ description: bio, updated_at: new Date().toISOString() })
        .eq('id', developerId);

    if (error) {
        showToast(error.message, 'error');
    } else {
        showToast('Bio updated successfully!', 'success');
    }
    setIsEditingBio(false);
  };
  
  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (userRating === 0) {
      setReviewError('Please select a rating.');
      return;
    }
    if (!userComment.trim()) {
      setReviewError('Please enter a comment.');
      return;
    }
    
    const { error } = await supabase.from('reviews').insert({
        developer_id: developerId,
        user_id: session?.user?.id,
        reviewer_name: session?.user?.user_metadata?.full_name || 'Anonymous User',
        rating: userRating,
        comment: userComment.trim(),
    });

    if (error) {
        showToast(error.message, 'error');
    } else {
        showToast('Thank you for your review!', 'success');
        await fetchReviews(); // Re-fetch reviews to show the new one
        setUserRating(0);
        setUserComment('');
        setReviewError('');
    }
  };

  useEffect(() => {
    if (bioTextareaRef.current) {
      bioTextareaRef.current.style.height = 'auto';
      bioTextareaRef.current.style.height = `${bioTextareaRef.current.scrollHeight}px`;
    }
  }, [bio, isEditingBio]);
  
  const handleOpenModal = (service: Service) => setSelectedService(service);
  const handleCloseModal = () => setSelectedService(null);

  let priceRange: string | null = null;
  if (developerServices.length > 0) {
    const prices = developerServices.map(s => s.price);
    const minPrice = Math.min(...prices);
    const maxPrice = Math.max(...prices);
    priceRange = minPrice === maxPrice ? `$${minPrice}` : `$${minPrice} - $${maxPrice}`;
  }

  if (isLoading) {
    return (
        <div className="flex justify-center items-center h-screen">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
        </div>
      );
  }

  return (
    <>
      <div className="bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="max-w-6xl mx-auto">
            {/* --- Developer Header --- */}
            <div className="md:flex items-start space-x-0 md:space-x-8 mb-12">
              <img src={`https://i.pravatar.cc/150?u=${developerId}`} alt={developerName} className="w-32 h-32 rounded-full object-cover shadow-lg mx-auto md:mx-0 flex-shrink-0" />
              <div className="mt-6 md:mt-0 text-center md:text-left flex-grow">
                <div className="md:flex justify-between items-center">
                    <div>
                        <h1 className="text-4xl font-extrabold font-heading text-gray-900 inline-flex items-center">
                          {developerName}
                          {isVerified && (
                            <span title="Verified Developer">
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 ml-3 text-primary" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>
                            </span>
                          )}
                        </h1>
                        <p className={`text-lg mt-1 font-semibold ${isVerified ? 'text-primary' : 'text-gray-500'}`}>
                            {isVerified ? 'Verified Developer' : 'Not Verified'}
                        </p>
                    </div>
                    <button onClick={() => onNavigate('contact', { developer_id: developerId, developerName })} className="mt-4 md:mt-0 bg-accent text-white font-bold py-3 px-6 rounded-lg hover:bg-emerald-600 transition-transform transform hover:scale-105 shadow-lg whitespace-nowrap">
                        Contact Developer
                    </button>
                </div>
                
                <div className="mt-4 flex items-center justify-center md:justify-start space-x-6 border-t border-b border-gray-200 py-3">
                    <div className="text-center">
                        <p className="font-bold text-xl text-gray-900">{developerServices.length}</p>
                        <p className="text-sm text-gray-500">Services</p>
                    </div>
                     <div className="border-l h-8 border-gray-300"></div>
                     <div className="text-center">
                        <div className="flex items-center justify-center">
                           <p className="font-bold text-xl text-gray-900 mr-2">{averageRating.toFixed(1)}</p>
                           <StarRatingDisplay rating={averageRating} />
                        </div>
                        <p className="text-sm text-gray-500">{reviews.length} reviews</p>
                    </div>
                    {priceRange && (
                      <>
                        <div className="border-l h-8 border-gray-300"></div>
                        <div className="text-center">
                            <p className="font-bold text-xl text-gray-900">{priceRange}</p>
                            <p className="text-sm text-gray-500">Pricing</p>
                        </div>
                      </>
                    )}
                </div>

                {/* --- Bio Section --- */}
                <div className="mt-4 max-w-2xl">
                  <div className="flex justify-between items-center mb-2">
                    <label htmlFor="developer-bio" className="font-bold text-gray-800">About {developerName}</label>
                    <div className="flex items-center">
                       {isEditingBio ? (
                        <button onClick={handleSaveBioClick} className="bg-accent text-white font-bold py-2 px-4 rounded-lg hover:bg-emerald-600 text-sm">Save Bio</button>
                       ) : (
                        session?.user?.id === developerId && (
                          <button onClick={handleEditBioClick} className="bg-gray-200 text-gray-800 font-bold py-2 px-4 rounded-lg hover:bg-gray-300 text-sm">Edit Bio</button>
                        )
                       )}
                    </div>
                  </div>
                  <textarea id="developer-bio" ref={bioTextareaRef} value={bio} onChange={(e) => setBio(e.target.value)} readOnly={!isEditingBio} className={`w-full min-h-[120px] p-3 text-gray-600 leading-relaxed rounded-lg resize-none overflow-hidden ${isEditingBio ? 'bg-white border-primary ring-2 ring-primary/50' : 'bg-secondary border-transparent cursor-default'}`} rows={4} />
                </div>
              </div>
            </div>

            {/* --- Reviews Section --- */}
            <div className="mt-16">
              <h2 className="text-2xl font-bold font-heading text-gray-800 mb-6 border-b border-gray-300 pb-4">Customer Reviews</h2>
              
              {session ? (
                  <form onSubmit={handleReviewSubmit} className="bg-secondary p-6 rounded-lg mb-8">
                      <h3 className="text-lg font-bold text-gray-800 mb-2">Leave a Review</h3>
                      <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Your Rating</label>
                        <StarRatingInput rating={userRating} setRating={setUserRating} />
                      </div>
                      <div className="mb-4">
                        <label htmlFor="review-comment" className="block text-sm font-medium text-gray-700 mb-1">Your Comment</label>
                        <textarea id="review-comment" value={userComment} onChange={e => setUserComment(e.target.value)} rows={4} className="w-full p-3 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary" placeholder="Share your experience..."></textarea>
                      </div>
                      {reviewError && <p className="text-red-500 text-sm mb-4">{reviewError}</p>}
                      <button type="submit" className="bg-primary text-white font-bold py-2 px-6 rounded-lg hover:bg-blue-900">Submit Review</button>
                  </form>
              ) : (
                 <p className="bg-blue-50 text-blue-800 p-4 rounded-lg mb-8 text-center">
                    You must be <button onClick={() => onNavigate('auth')} className="font-bold underline">logged in</button> to leave a review.
                 </p>
              )}
              
              {reviews.length > 0 ? (
                <div className="space-y-6">
                  {reviews.map(review => (
                    <div key={review.id} className="bg-white p-5 rounded-lg shadow-sm border">
                      <div className="flex items-center mb-2">
                        <StarRatingDisplay rating={review.rating} />
                        <span className="ml-auto text-sm text-gray-500">{new Date(review.created_at).toLocaleDateString()}</span>
                      </div>
                      <p className="text-gray-700 mb-2">{review.comment}</p>
                      <p className="font-semibold text-gray-800 text-sm">&mdash; {review.reviewer_name}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-600 text-center py-8 bg-secondary rounded-lg">No reviews yet. Be the first to share your feedback!</p>
              )}
            </div>


            {/* --- Developer Services --- */}
            <div className="bg-secondary p-8 rounded-lg mt-16">
              <h2 className="text-2xl font-bold font-heading text-gray-800 mb-6 border-b border-gray-300 pb-4">Services by {developerName}</h2>
              
              {developerServices.length > 0 ? (
                <>
                  <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {paginatedServices.map(service => (
                      <ServiceCard 
                        key={service.id} 
                        service={service} 
                        onOpenModal={handleOpenModal} 
                        onAddToCart={onAddToCart}
                        onNavigate={onNavigate}
                      />
                    ))}
                  </div>
                  {totalPages > 1 && (
                    <Pagination 
                      currentPage={currentPage}
                      totalPages={totalPages}
                      onPageChange={setCurrentPage}
                    />
                  )}
                </>
              ) : (
                <p className="text-gray-600">This developer has not listed any services yet.</p>
              )}

              <button
                onClick={() => onNavigate('home')}
                className="inline-block mt-12 bg-primary text-white font-bold py-3 px-8 rounded-lg hover:bg-blue-900 transition-transform transform hover:scale-105 shadow-lg"
              >
                &larr; Back to All Services
              </button>
            </div>
          </div>
        </div>
      </div>
      {selectedService && (
        <ServiceQuickViewModal 
          service={selectedService} 
          onClose={handleCloseModal}
          onAddToCart={onAddToCart}
          onNavigate={onNavigate}
        />
      )}
    </>
  );
};

export default DeveloperProfilePage;