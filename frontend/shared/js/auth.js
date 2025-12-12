// ========== Employee Authentication UI Functions ==========

// Auth Modal Functions
function toggleAuthModal() {
    const modal = document.getElementById('authModal');
    modal.classList.toggle('hidden');

    // If user is logged in, show logout option
    const employee = getLoggedInEmployee();
    if (employee) {
        // Hide login and signup forms
        document.getElementById('loginForm').classList.add('hidden');
        document.getElementById('signupForm').classList.add('hidden');
        document.getElementById('logoutBtn').classList.remove('hidden');

        // Hide tabs when logged in
        const tabsDiv = document.querySelector('#authModal .flex.gap-4.mb-6');
        if (tabsDiv) {
            tabsDiv.classList.add('hidden');
        }

        // Show profile info
        document.querySelector('#authModal h2').textContent = `Hello, ${employee.name}!`;
        document.querySelector('#authModal p').textContent = `Employee ID: ${employee.employeeId}`;

        // Show profile details
        showProfileDetails(employee);
    } else {
        // If not logged in, ensure login form is visible and logout is hidden
        document.getElementById('loginForm').classList.remove('hidden');
        document.getElementById('signupForm').classList.add('hidden');
        document.getElementById('logoutBtn').classList.add('hidden');

        // Show tabs when logged out
        const tabsDiv = document.querySelector('#authModal .flex.gap-4.mb-6');
        if (tabsDiv) {
            tabsDiv.classList.remove('hidden');
        }

        // Hide profile details
        const profileDiv = document.getElementById('profileDetails');
        if (profileDiv) {
            profileDiv.classList.add('hidden');
        }

        document.querySelector('#authModal h2').textContent = `Welcome Back!`;
        document.querySelector('#authModal p').textContent = `Login with your Employee ID`;
        switchAuthTab('login'); // Ensure login tab is active
    }
}

function showProfileDetails(employee) {
    let profileDiv = document.getElementById('profileDetails');

    if (!profileDiv) {
        // Create profile details div if it doesn't exist
        profileDiv = document.createElement('div');
        profileDiv.id = 'profileDetails';
        profileDiv.className = 'space-y-4 mb-4';

        // Insert after the p tag
        const pTag = document.querySelector('#authModal p');
        pTag.parentNode.insertBefore(profileDiv, pTag.nextSibling);
    }

    profileDiv.classList.remove('hidden');
    profileDiv.innerHTML = `
    <div class="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 space-y-3">
      <div class="flex items-center justify-between">
        <span class="text-sm text-gray-600 dark:text-gray-400">Name:</span>
        <span class="text-sm font-semibold text-gray-900 dark:text-white">${employee.name}</span>
      </div>
      <div class="flex items-center justify-between">
        <span class="text-sm text-gray-600 dark:text-gray-400">Email:</span>
        <span class="text-sm font-semibold text-gray-900 dark:text-white">${employee.email}</span>
      </div>
      <div class="flex items-center justify-between">
        <span class="text-sm text-gray-600 dark:text-gray-400">Mobile:</span>
        <span class="text-sm font-semibold text-gray-900 dark:text-white">${employee.mobile}</span>
      </div>
      ${employee.department ? `
      <div class="flex items-center justify-between">
        <span class="text-sm text-gray-600 dark:text-gray-400">Department:</span>
        <span class="text-sm font-semibold text-gray-900 dark:text-white">${employee.department}</span>
      </div>
      ` : ''}
    </div>
    <button onclick="toggleEditProfile()" class="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 rounded-lg transition-all flex items-center justify-center gap-2">
      <span class="material-icons-outlined text-sm">edit</span>
      Edit Profile
    </button>
  `;
}

function toggleEditProfile() {
    alert('Profile edit feature coming soon!');
    // TODO: Implement profile edit functionality
}

function switchAuthTab(tab) {
    const loginTab = document.getElementById('loginTab');
    const signupTab = document.getElementById('signupTab');
    const loginForm = document.getElementById('loginForm');
    const signupForm = document.getElementById('signupForm');

    if (tab === 'login') {
        loginTab.className = 'pb-3 px-4 font-semibold text-primary border-b-2 border-primary';
        signupTab.className = 'pb-3 px-4 font-semibold text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200';
        loginForm.classList.remove('hidden');
        signupForm.classList.add('hidden');
    } else {
        signupTab.className = 'pb-3 px-4 font-semibold text-primary border-b-2 border-primary';
        loginTab.className = 'pb-3 px-4 font-semibold text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200';
        signupForm.classList.remove('hidden');
        loginForm.classList.add('hidden');
    }
}

// Employee Session Management
function saveEmployeeSession(employee) {
    localStorage.setItem('employee', JSON.stringify(employee));
    updateUIForLoggedInUser(employee);
}

function getLoggedInEmployee() {
    const employee = localStorage.getItem('employee');
    return employee ? JSON.parse(employee) : null;
}

function clearEmployeeSession() {
    localStorage.removeItem('employee');
    updateUIForGuest();
}

function updateUIForLoggedInUser(employee) {
    const userNameEl = document.getElementById('userName');
    const userAvatarEl = document.getElementById('userAvatar');

    if (userNameEl) {
        userNameEl.textContent = employee.name;
    }
    if (userAvatarEl) {
        userAvatarEl.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(employee.name)}&background=10b981`;
    }
}

function updateUIForGuest() {
    const userNameEl = document.getElementById('userName');
    const userAvatarEl = document.getElementById('userAvatar');

    if (userNameEl) {
        userNameEl.textContent = 'Guest';
    }
    if (userAvatarEl) {
        userAvatarEl.src = 'https://ui-avatars.com/api/?name=Guest&background=10b981';
    }
}

// Handle Login
async function handleLogin(event) {
    event.preventDefault();
    const btn = document.getElementById('loginBtn');
    const originalText = btn.textContent;

    try {
        btn.disabled = true;
        btn.textContent = 'Logging in...';

        const employeeId = document.getElementById('loginEmployeeId').value.trim();
        const mobile = document.getElementById('loginMobile').value.trim();

        const response = await EmployeeAuthAPI.login({ employeeId, mobile });

        if (response.success) {
            saveEmployeeSession(response.data);
            toggleAuthModal();
            alert('Login successful!');

            // Reset form
            document.getElementById('loginForm').reset();

            // Reload page to update all elements
            window.location.reload();
        }
    } catch (error) {
        alert(error.message || 'Login failed. Please check your credentials.');
    } finally {
        btn.disabled = false;
        btn.textContent = originalText;
    }
}

// Handle Signup
async function handleSignup(event) {
    event.preventDefault();
    const btn = document.getElementById('signupBtn');
    const originalText = btn.textContent;

    try {
        btn.disabled = true;
        btn.textContent = 'Signing up...';

        const employeeData = {
            employeeId: document.getElementById('signupEmployeeId').value.trim(),
            name: document.getElementById('signupName').value.trim(),
            email: document.getElementById('signupEmail').value.trim(),
            mobile: document.getElementById('signupMobile').value.trim(),
            department: document.getElementById('signupDepartment').value.trim() || undefined
        };

        const response = await EmployeeAuthAPI.signup(employeeData);

        if (response.success) {
            alert('Registration successful! You can now login.');
            switchAuthTab('login');

            // Pre-fill login form
            document.getElementById('loginEmployeeId').value = employeeData.employeeId;
            document.getElementById('loginMobile').value = employeeData.mobile;

            // Reset signup form
            document.getElementById('signupForm').reset();
        }
    } catch (error) {
        alert(error.message || 'Signup failed. Please try again.');
    } finally {
        btn.disabled = false;
        btn.textContent = originalText;
    }
}

// Handle Logout
function handleLogout() {
    if (confirm('Are you sure you want to logout?')) {
        clearEmployeeSession();
        toggleAuthModal();

        // Reset modal
        document.getElementById('logoutBtn').classList.add('hidden');
        document.getElementById('loginForm').classList.remove('hidden');
        switchAuthTab('login');

        // Reload page to update all elements
        window.location.reload();
    }
}

// Check if user is logged in (for protected actions)
function requireLogin(message = 'Please login to continue') {
    const employee = getLoggedInEmployee();
    if (!employee) {
        alert(message);
        toggleAuthModal();
        return false;
    }
    return true;
}

// Initialize auth UI on page load
function initializeAuth() {
    const employee = getLoggedInEmployee();
    if (employee) {
        updateUIForLoggedInUser(employee);
    } else {
        updateUIForGuest();
    }
}

// Auto-initialize when script loads
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeAuth);
} else {
    initializeAuth();
}
