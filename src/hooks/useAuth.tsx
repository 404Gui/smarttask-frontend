// // hooks/useAuth.ts
// 'use client';
// import { useEffect, useState } from 'react';
// import { useRouter } from 'next/navigation';
// import Cookies from 'js-cookie';
// import api from '@/services/api';

// export default function useAuth(redirect = true) {
//   const [user, setUser] = useState(null);
//   const router = useRouter();

//   useEffect(() => {
//     const token = Cookies.get('token');
//     if (!token && redirect) {
//       router.push('/login');
//       return;
//     }

//     const fetchUser = async () => {
//       try {
//         const res = await api.get('/me', {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         });
//         setUser(res.data);
//       } catch (err) {
//         Cookies.remove('token');
//         if (redirect) router.push('/login');
//       }
//     };

//     if (token) fetchUser();
//   }, [redirect, router]);

//   return { user };
// }
