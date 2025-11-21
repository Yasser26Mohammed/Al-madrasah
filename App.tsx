
import React, { useState } from 'react';
import { AdminPortal } from './pages/AdminPortal';
import { TeacherPortal } from './pages/TeacherPortal';
import { ParentPortal } from './pages/ParentPortal';
import { StudentPortal } from './pages/StudentPortal';
import { UserRole, GRADE_LEVELS, SUBJECTS } from './types';
import { dataService } from './services/mockData';
import { School, Lock, User, Users, BookOpen, GraduationCap, UserPlus, ArrowRight } from 'lucide-react';

const App: React.FC = () => {
  const [user, setUser] = useState<{ role: UserRole; id?: string; name?: string } | null>(null);

  // UI States
  const [loginTab, setLoginTab] = useState<UserRole>(UserRole.ADMIN);
  const [isRegistering, setIsRegistering] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Login Inputs
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  // Registration Inputs
  const [regName, setRegName] = useState('');
  const [regUsername, setRegUsername] = useState(''); // Also used for seatNumber
  const [regPassword, setRegPassword] = useState('');
  const [regGrade, setRegGrade] = useState('');
  const [regSubject, setRegSubject] = useState('');
  const [regChildSeats, setRegChildSeats] = useState('');
  const [regGrades, setRegGrades] = useState<string[]>([]);

  const resetForms = () => {
    setUsername('');
    setPassword('');
    setRegName('');
    setRegUsername('');
    setRegPassword('');
    setRegGrade('');
    setRegSubject('');
    setRegChildSeats('');
    setRegGrades([]);
    setError('');
    setSuccessMsg('');
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');

    if (loginTab === UserRole.ADMIN) {
      if (username === 'admin' && password === '1234') {
        setUser({ role: UserRole.ADMIN, name: 'المدير العام' });
      } else {
        setError('بيانات المدير غير صحيحة (جرب admin / 1234)');
      }
    } else if (loginTab === UserRole.TEACHER) {
      const teacher = dataService.loginTeacher(username, password);
      if (teacher) setUser({ role: UserRole.TEACHER, id: teacher.id, name: teacher.name });
      else setError('اسم المستخدم أو كلمة المرور خطأ');
    } else if (loginTab === UserRole.PARENT) {
      const parent = dataService.loginParent(username, password);
      if (parent) setUser({ role: UserRole.PARENT, id: parent.id, name: parent.name });
      else setError('اسم المستخدم أو كلمة المرور خطأ');
    } else if (loginTab === UserRole.STUDENT) {
      const student = dataService.loginStudent(username, password);
      if (student) setUser({ role: UserRole.STUDENT, id: student.id, name: student.name });
      else setError('رقم الجلوس أو كلمة المرور خطأ');
    }
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    try {
        if (loginTab === UserRole.TEACHER) {
            if (!regName || !regUsername || !regPassword || !regSubject || regGrades.length === 0) throw new Error('جميع الحقول مطلوبة');
            dataService.registerTeacher(regName, regUsername, regSubject, regGrades, regPassword);
            setSuccessMsg('تم إنشاء حساب المعلم بنجاح! يمكنك الدخول الآن.');
            setIsRegistering(false);
        } else if (loginTab === UserRole.STUDENT) {
             if (!regName || !regUsername || !regPassword || !regGrade) throw new Error('جميع الحقول مطلوبة');
             dataService.registerStudent(regName, regUsername, regGrade, regPassword);
             setSuccessMsg('تم إنشاء حساب الطالب بنجاح! قم بتسجيل الدخول برقم الجلوس.');
             setIsRegistering(false);
        } else if (loginTab === UserRole.PARENT) {
             if (!regName || !regUsername || !regPassword) throw new Error('البيانات الأساسية مطلوبة');
             const seats = regChildSeats.split(',').map(s => s.trim()).filter(s => s);
             dataService.registerParent(regName, regUsername, seats, regPassword);
             setSuccessMsg('تم إنشاء حساب ولي الأمر وربط الأبناء (إن وجدوا).');
             setIsRegistering(false);
        }
    } catch (err: any) {
        setError(err.message);
    }
  };

  const handleLogout = () => {
    setUser(null);
    resetForms();
  };

  // Route to portals
  if (user) {
    switch (user.role) {
      case UserRole.ADMIN: return <AdminPortal onLogout={handleLogout} />;
      case UserRole.TEACHER: return <TeacherPortal onLogout={handleLogout} teacherId={user.id!} />;
      case UserRole.PARENT: return <ParentPortal onLogout={handleLogout} parentId={user.id!} />;
      case UserRole.STUDENT: return <StudentPortal onLogout={handleLogout} studentId={user.id!} />;
    }
  }

  // --- Auth Screen ---
  
  const getRoleColor = () => {
      switch(loginTab) {
          case UserRole.ADMIN: return 'indigo';
          case UserRole.TEACHER: return 'teal';
          case UserRole.PARENT: return 'orange';
          case UserRole.STUDENT: return 'blue';
          default: return 'gray';
      }
  };
  
  const themeColor = getRoleColor();

  return (
    <div className={`min-h-screen flex items-center justify-center bg-gradient-to-br from-${themeColor}-50 to-gray-100 p-4`} dir="rtl">
      <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden">
        
        {/* Header */}
        <div className={`bg-${themeColor}-600 p-8 text-center text-white transition-colors duration-300`}>
          <div className="mx-auto bg-white/20 w-16 h-16 rounded-full flex items-center justify-center mb-4 backdrop-blur-sm">
             {loginTab === UserRole.ADMIN && <Lock size={32} />}
             {loginTab === UserRole.TEACHER && <BookOpen size={32} />}
             {loginTab === UserRole.PARENT && <Users size={32} />}
             {loginTab === UserRole.STUDENT && <GraduationCap size={32} />}
          </div>
          <h1 className="text-2xl font-bold">نظام مدرستي الذكي</h1>
          <p className="text-white/80 mt-2 text-sm font-medium">
            {isRegistering ? 'إنشاء حساب جديد' : 'تسجيل الدخول'} - {
                loginTab === UserRole.ADMIN ? 'الإدارة' : 
                loginTab === UserRole.TEACHER ? 'المعلمين' :
                loginTab === UserRole.PARENT ? 'أولياء الأمور' : 'الطلاب'
            }
          </p>
        </div>

        {/* Role Tabs */}
        <div className="grid grid-cols-4 border-b border-gray-100">
           {[
               { role: UserRole.ADMIN, icon: Lock, label: 'إدارة' },
               { role: UserRole.TEACHER, icon: BookOpen, label: 'معلم' },
               { role: UserRole.STUDENT, icon: GraduationCap, label: 'طالب' },
               { role: UserRole.PARENT, icon: Users, label: 'ولي أمر' }
           ].map(tab => (
               <button
                  key={tab.role}
                  onClick={() => { setLoginTab(tab.role as UserRole); resetForms(); setIsRegistering(false); }}
                  className={`py-4 flex flex-col items-center gap-1 text-xs font-bold transition-all ${
                      loginTab === tab.role 
                      ? `bg-white text-${getRoleColor()}-600 border-b-2 border-${getRoleColor()}-600` 
                      : 'bg-gray-50 text-gray-400 hover:bg-gray-100'
                  }`}
               >
                   <tab.icon size={20} />
                   {tab.label}
               </button>
           ))}
        </div>

        <div className="p-8">
            {/* Success/Error Messages */}
            {successMsg && <div className="mb-4 p-3 bg-green-50 text-green-700 rounded-lg text-sm flex items-center gap-2"><CheckCircleIcon /> {successMsg}</div>}
            {error && <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-lg text-sm font-medium text-center">{error}</div>}

            {!isRegistering ? (
                // LOGIN FORM
                <form onSubmit={handleLogin} className="space-y-5">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            {loginTab === UserRole.STUDENT ? 'رقم الجلوس' : 'اسم المستخدم'}
                        </label>
                        <input
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
                            placeholder={loginTab === UserRole.STUDENT ? "مثال: 1001" : ""}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">كلمة المرور</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
                            placeholder="••••••••"
                        />
                    </div>
                    
                    <button
                        type="submit"
                        className={`w-full py-3 text-white font-bold rounded-xl shadow-lg shadow-${themeColor}-500/30 transform transition active:scale-95 bg-${themeColor}-600 hover:bg-${themeColor}-700`}
                    >
                        دخول
                    </button>
                    
                    {loginTab !== UserRole.ADMIN && (
                        <div className="mt-4 text-center">
                            <button 
                                type="button"
                                onClick={() => { setIsRegistering(true); resetForms(); }}
                                className={`text-sm font-medium text-${themeColor}-600 hover:underline flex items-center justify-center gap-1 mx-auto`}
                            >
                                <UserPlus size={16} /> ليس لديك حساب؟ إنشاء حساب جديد
                            </button>
                        </div>
                    )}
                </form>
            ) : (
                // REGISTER FORM
                <form onSubmit={handleRegister} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-1">الاسم الكامل</label>
                            <input
                                type="text"
                                value={regName}
                                onChange={(e) => setRegName(e.target.value)}
                                className="w-full px-4 py-2 border rounded-lg focus:ring-1 outline-none"
                                required
                            />
                        </div>
                        
                        <div className="col-span-2 sm:col-span-1">
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                {loginTab === UserRole.STUDENT ? 'رقم الجلوس' : 'اسم المستخدم'}
                            </label>
                            <input
                                type="text"
                                value={regUsername}
                                onChange={(e) => setRegUsername(e.target.value)}
                                className="w-full px-4 py-2 border rounded-lg focus:ring-1 outline-none"
                                required
                            />
                        </div>
                         <div className="col-span-2 sm:col-span-1">
                            <label className="block text-sm font-medium text-gray-700 mb-1">كلمة المرور</label>
                            <input
                                type="password"
                                value={regPassword}
                                onChange={(e) => setRegPassword(e.target.value)}
                                className="w-full px-4 py-2 border rounded-lg focus:ring-1 outline-none"
                                required
                            />
                        </div>
                    </div>

                    {/* Teacher Specifics */}
                    {loginTab === UserRole.TEACHER && (
                        <>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">المادة</label>
                                <select 
                                    value={regSubject} 
                                    onChange={(e) => setRegSubject(e.target.value)}
                                    className="w-full px-4 py-2 border rounded-lg bg-white"
                                >
                                    <option value="">اختر المادة...</option>
                                    {SUBJECTS.map(s => <option key={s} value={s}>{s}</option>)}
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">الصفوف التي تدرسها</label>
                                <div className="grid grid-cols-2 gap-2 bg-gray-50 p-2 rounded-lg border">
                                    {GRADE_LEVELS.map(g => (
                                        <label key={g} className="flex items-center gap-2 text-xs cursor-pointer">
                                            <input 
                                                type="checkbox" 
                                                checked={regGrades.includes(g)}
                                                onChange={(e) => {
                                                    if(e.target.checked) setRegGrades([...regGrades, g]);
                                                    else setRegGrades(regGrades.filter(gr => gr !== g));
                                                }}
                                            />
                                            {g}
                                        </label>
                                    ))}
                                </div>
                            </div>
                        </>
                    )}

                    {/* Student Specifics */}
                    {loginTab === UserRole.STUDENT && (
                         <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">الصف الدراسي</label>
                            <select 
                                value={regGrade} 
                                onChange={(e) => setRegGrade(e.target.value)}
                                className="w-full px-4 py-2 border rounded-lg bg-white"
                            >
                                <option value="">اختر الصف...</option>
                                {GRADE_LEVELS.map(g => <option key={g} value={g}>{g}</option>)}
                            </select>
                        </div>
                    )}

                    {/* Parent Specifics */}
                    {loginTab === UserRole.PARENT && (
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">أرقام جلوس الأبناء (اختياري)</label>
                            <input
                                type="text"
                                value={regChildSeats}
                                onChange={(e) => setRegChildSeats(e.target.value)}
                                className="w-full px-4 py-2 border rounded-lg focus:ring-1 outline-none"
                                placeholder="مثال: 1001, 1002"
                            />
                            <p className="text-xs text-gray-400 mt-1">افصل بين الأرقام بفاصلة. سيتم ربطهم تلقائياً.</p>
                        </div>
                    )}

                    <button
                        type="submit"
                        className={`w-full py-3 mt-2 text-white font-bold rounded-xl shadow-lg bg-${themeColor}-600 hover:bg-${themeColor}-700`}
                    >
                        تسجيل حساب جديد
                    </button>
                    
                    <div className="text-center">
                        <button 
                            type="button"
                            onClick={() => { setIsRegistering(false); resetForms(); }}
                            className="text-sm text-gray-500 hover:text-gray-800 flex items-center justify-center gap-1 mx-auto"
                        >
                            <ArrowRight size={14} /> العودة لتسجيل الدخول
                        </button>
                    </div>
                </form>
            )}
        </div>
      </div>
    </div>
  );
};

// Simple Check Icon component for success message
const CheckCircleIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
    </svg>
);

export default App;
