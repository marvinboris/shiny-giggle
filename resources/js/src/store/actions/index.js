export {
    authLogin,
    authPhoto,
    authSignup,
    forgotPassword,
    resetPassword,
    authGuest,
    authCode,
    authAdmin,
    authVerify,
    resendCode,
    clearSignup,
    authLogout,
    setAuthRedirectPath,
    setHash,
    authCheckState,
} from './auth';

export {
    getPlans,
    getPaymentInfo,
    postLimoPayment,
} from './payment';

export {
    makeCalculation,
    makeCalculationStart,
    setSelectedPlan,
    getCalculate,
    getCalculateFromCode,
    getUserPlans
} from './calculation';

export {
    resetNotifications,
    getNotifications,
    getNotification,

    resetContactUs,
    resetDashboard,

    getUserContactUsList,
    getUserContactUs,
    postUserContactUs,
    resetSimulation,

    resetOptions,
    getAutoReinvests,
    getAutoReinvest,
    getAutoReinvestInit,
    postAutoReinvest,

    getUserDashboard,

    resetUserPackages,

    resetCalculate,
    getUserCalculatePlans,
    getUserCalculatePlan,
    postUserCalculate,

    resetTontine,
    getUserTontinePlans,
    getUserTontinePlan,
    postUserTontine,



    getAdminDashboard,

    resetUsers,
    getAdminUsers,
    getAdminUser,
    postAdminAddUser,
    postAdminEditUser,
    postAdminDeleteUser,

    resetFinances,
    getAdminSalesReport,
    getAdminLimoPayments,
    getAdminLimoPayment,
    postAdminLimoPayment,
    getAdminCreditsList,
    postAdminAddCredit,

    getAdminContactUsList,
    getAdminContactUs,
    postAdminEditContactUs,
    postAdminDeleteContactUs,

    resetPlans,
    getAdminPlans,
    getAdminPlanDetails,
    postAdminAddPlan,
    postAdminPlanDeposit,
    postAdminCalculationsDeposit,
} from './backend';