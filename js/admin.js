```javascript
// Admin Configuration
const ADMIN_PASSWORD = 'KYRAzero77';
const GITHUB_TOKEN = 'KYRAzero77';
const GITHUB_REPO = 'mick890891/DiscordBotStore';
const PRODUCTS_FILE = 'data/products.json';

let products = [];
let editingProductId = null;

// Login handler
document.getElementById('loginBtn').addEventListener('click', () => {
    const password = document.getElementById('adminPassword').value;
    if (password === ADMIN_PASSWORD) {
        document.getElementById('loginScreen').style.display = 'none';
        document.getElementById('adminPanel').style.display = 'block';
        loadAdminProducts();
    } else {
        alert('Invalid password!');
    }
});

// Logout handler
document.getElementById('logoutBtn').addEventListener('click', () => {
    document.getElementById('loginScreen').style.display = 'flex';
    document.getElementById('adminPanel').style.display = 'none';
    document.getElementById('adminPassword').value = '';
});

// Load products for admin
async function loadAdminProducts() {
    try {
        const response = await fetch('data/products.json');
        products = await response.json();
        displayAdminProducts();
    } catch (error) {
        console.error('Error loading products:', error);
    }
}

// Display products in admin
function displayAdminProducts() {
    const grid = document.getElementById('productsAdmin');
    grid.innerHTML = products.map(product => `
        
            ${product.name}
            ${product.price.toFixed(2)}
            ${product.type}
            
                ✏️ Edit
                🗑️ Delete
            
        
    `).join('');
}

// Add product button
document.getElementById('addProductBtn').addEventListener('click', () => {
    editingProductId = null;
    document.getElementById('formTitle').textContent = 'Add Product';
    document.getElementById('productName').value = '';
    document.getElementById('productDescription').value = '';
    document.getElementById('productPrice').value = '';
    document.getElementById('productImage').value = '';
    document.getElementById('productType').value = 'file';
    document.getElementById('editForm').style.display = 'block';
});

// Edit product
function editProduct(id) {
    const product = products.find(p => p.id === id);
    if (!product) return;

    editingProductId = id;
    document.getElementById('formTitle').textContent = 'Edit Product';
    document.getElementById('productName').value = product.name;
    document.getElementById('productDescription').value = product.description;
    document.getElementById('productPrice').value = product.price;
    document.getElementById('productImage').value = product.image;
    document.getElementById('productType').value = product.type;
    document.getElementById('editForm').style.display = 'block';
}

// Delete product
function deleteProduct(id) {
    if (!confirm('Are you sure you want to delete this product?')) return;
    
    products = products.filter(p => p.id !== id);
    saveProductsToGitHub();
}

// Save product
document.getElementById('saveProductBtn').addEventListener('click', () => {
    const name = document.getElementById('productName').value.trim();
    const description = document.getElementById('productDescription').value.trim();
    const price = parseFloat(document.getElementById('productPrice').value);
    const image = document.getElementById('productImage').value.trim();
    const type = document.getElementById('productType').value;

    if (!name || !description || !price || !image) {
        alert('Please fill all fields!');
        return;
    }

    if (editingProductId) {
        const index = products.findIndex(p => p.id === editingProductId);
        products[index] = { id: editingProductId, name, description, price, image, type };
    } else {
        const newId = products.length > 0 ? Math.max(...products.map(p => p.id)) + 1 : 1;
        products.push({ id: newId, name, description, price, image, type });
    }

    saveProductsToGitHub();
    document.getElementById('editForm').style.display = 'none';
});

// Cancel edit
document.getElementById('cancelEditBtn').addEventListener('click', () => {
    document.getElementById('editForm').style.display = 'none';
});

// Save products to GitHub
async function saveProductsToGitHub() {
    try {
        // Get current file SHA
        const getResponse = await fetch(
            `https://api.github.com/repos/${GITHUB_REPO}/contents/${PRODUCTS_FILE}`,
            {
                headers: {
                    'Authorization': `token ${GITHUB_TOKEN}`,
                    'Accept': 'application/vnd.github.v3+json'
                }
            }
        );
        
        const currentFile = await getResponse.json();
        const sha = currentFile.sha;

        // Update file
        const content = btoa(JSON.stringify(products, null, 2));
        
        await fetch(
            `https://api.github.com/repos/${GITHUB_REPO}/contents/${PRODUCTS_FILE}`,
            {
                method: 'PUT',
                headers: {
                    'Authorization': `token ${GITHUB_TOKEN}`,
                    'Accept': 'application/vnd.github.v3+json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    message: 'Update products',
                    content: content,
                    sha: sha
                })
            }
        );

        alert('Products updated successfully!');
        displayAdminProducts();
    } catch (error) {
        console.error('Error saving to GitHub:', error);
        alert('Failed to save products. Check console for details.');
    }
}
```

---

