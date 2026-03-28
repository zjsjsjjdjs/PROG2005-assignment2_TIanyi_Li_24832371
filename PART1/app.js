"use strict";
class InventoryManager {
    constructor() {
        this.items = [];
        this.editMode = false;
        this.editItemId = null;
        this.initSampleData();
        this.bindEvents();
        this.renderTable();
    }
    initSampleData() {
        this.items.push({
            id: '1',
            name: 'Laptop',
            category: 'Electronics',
            quantity: 10,
            price: 999.99,
            supplier: 'TechCorp',
            stockStatus: 'In Stock',
            popular: 'Yes',
            comment: 'High performance'
        });
        this.items.push({
            id: '2',
            name: 'Desk Chair',
            category: 'Furniture',
            quantity: 3,
            price: 199.99,
            supplier: 'OfficeWorld',
            stockStatus: 'Low Stock',
            popular: 'No'
        });
    }
    bindEvents() {
        var _a, _b, _c, _d, _e;
        const form = document.getElementById('item-form');
        form.addEventListener('submit', (e) => this.handleSubmit(e));
        (_a = document.getElementById('search-btn')) === null || _a === void 0 ? void 0 : _a.addEventListener('click', () => this.searchByName());
        (_b = document.getElementById('show-all-btn')) === null || _b === void 0 ? void 0 : _b.addEventListener('click', () => this.renderTable());
        (_c = document.getElementById('show-popular-btn')) === null || _c === void 0 ? void 0 : _c.addEventListener('click', () => this.renderPopular());
        (_d = document.getElementById('cancel-edit')) === null || _d === void 0 ? void 0 : _d.addEventListener('click', () => this.cancelEdit());
        (_e = document.getElementById('search-name')) === null || _e === void 0 ? void 0 : _e.addEventListener('keypress', (e) => {
            if (e.key === 'Enter')
                this.searchByName();
        });
    }
    handleSubmit(e) {
        e.preventDefault();
        const form = e.target;
        const idInput = document.getElementById('item-id');
        const nameInput = document.getElementById('item-name');
        const categorySelect = document.getElementById('category');
        const quantityInput = document.getElementById('quantity');
        const priceInput = document.getElementById('price');
        const supplierInput = document.getElementById('supplier');
        const stockSelect = document.getElementById('stock-status');
        const popularSelect = document.getElementById('popular');
        const commentText = document.getElementById('comment');
        // 数据校验
        if (!nameInput.value.trim()) {
            alert('Item name is required');
            return;
        }
        const quantity = parseInt(quantityInput.value);
        if (isNaN(quantity) || quantity < 0) {
            alert('Quantity must be a non-negative number');
            return;
        }
        const price = parseFloat(priceInput.value);
        if (isNaN(price) || price < 0) {
            alert('Price must be a non-negative number');
            return;
        }
        const newItem = {
            id: idInput.value.trim(),
            name: nameInput.value.trim(),
            category: categorySelect.value,
            quantity,
            price,
            supplier: supplierInput.value.trim(),
            stockStatus: stockSelect.value,
            popular: popularSelect.value,
            comment: commentText.value.trim() || undefined
        };
        if (this.editMode && this.editItemId) {
            // 编辑模式：更新现有物品
            const index = this.items.findIndex(i => i.id === this.editItemId);
            if (index !== -1) {
                // 保持原ID不变，其他更新
                newItem.id = this.items[index].id;
                this.items[index] = newItem;
                this.showMessage('Item updated successfully');
            }
            this.cancelEdit();
        }
        else {
            // 新增模式：检查ID唯一性
            if (this.items.some(i => i.id === newItem.id)) {
                alert('Item ID must be unique');
                return;
            }
            this.items.push(newItem);
            this.showMessage('Item added successfully');
            this.clearForm();
        }
        this.renderTable();
    }
    editItem(id) {
        const item = this.items.find(i => i.id === id);
        if (!item)
            return;
        this.editMode = true;
        this.editItemId = id;
        // 填充表单
        document.getElementById('item-id').value = item.id;
        document.getElementById('item-name').value = item.name;
        document.getElementById('category').value = item.category;
        document.getElementById('quantity').value = item.quantity.toString();
        document.getElementById('price').value = item.price.toString();
        document.getElementById('supplier').value = item.supplier;
        document.getElementById('stock-status').value = item.stockStatus;
        document.getElementById('popular').value = item.popular;
        document.getElementById('comment').value = item.comment || '';
        document.getElementById('form-title').innerText = 'Edit Item';
        document.getElementById('submit-btn').innerText = 'Update Item';
        document.getElementById('cancel-edit').style.display = 'inline-block';
        document.getElementById('item-id').disabled = true; // 禁止修改ID
    }
    cancelEdit() {
        this.editMode = false;
        this.editItemId = null;
        this.clearForm();
        document.getElementById('form-title').innerText = 'Add New Item';
        document.getElementById('submit-btn').innerText = 'Add Item';
        document.getElementById('cancel-edit').style.display = 'none';
        document.getElementById('item-id').disabled = false;
    }
    deleteItem(id) {
        const item = this.items.find(i => i.id === id);
        if (item && confirm(`Are you sure you want to delete "${item.name}"?`)) {
            this.items = this.items.filter(i => i.id !== id);
            this.renderTable();
            this.showMessage('Item deleted');
            if (this.editMode && this.editItemId === id)
                this.cancelEdit();
        }
    }
    searchByName() {
        const searchTerm = document.getElementById('search-name').value.trim().toLowerCase();
        if (!searchTerm) {
            this.renderTable();
            return;
        }
        const filtered = this.items.filter(item => item.name.toLowerCase().includes(searchTerm));
        this.renderTable(filtered);
    }
    renderTable(itemsToRender = this.items) {
        const container = document.getElementById('inventory-table');
        if (!container)
            return;
        if (itemsToRender.length === 0) {
            container.innerHTML = '<p>No items found.</p>';
            return;
        }
        let html = `
            <table>
                <thead>
                    <tr>
                        <th>ID</th><th>Name</th><th>Category</th><th>Qty</th><th>Price</th>
                        <th>Supplier</th><th>Stock</th><th>Popular</th><th>Comment</th><th>Actions</th>
                    </tr>
                </thead>
                <tbody>
        `;
        for (const item of itemsToRender) {
            html += `
                <tr>
                    <td>${item.id}</td>
                    <td>${item.name}</td>
                    <td>${item.category}</td>
                    <td>${item.quantity}</td>
                    <td>$${item.price.toFixed(2)}</td>
                    <td>${item.supplier}</td>
                    <td>${item.stockStatus}</td>
                    <td>${item.popular}</td>
                    <td>${item.comment || '-'}</td>
                    <td class="action-buttons">
                        <button class="edit-btn" data-id="${item.id}">Edit</button>
                        <button class="delete-btn" data-id="${item.id}">Delete</button>
                    </td>
                </tr>
            `;
        }
        html += `</tbody></table>`;
        container.innerHTML = html;
        // 绑定动态按钮事件
        document.querySelectorAll('.edit-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const id = e.currentTarget.getAttribute('data-id');
                if (id)
                    this.editItem(id);
            });
        });
        document.querySelectorAll('.delete-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const id = e.currentTarget.getAttribute('data-id');
                if (id)
                    this.deleteItem(id);
            });
        });
    }
    renderPopular() {
        const popularItems = this.items.filter(item => item.popular === 'Yes');
        this.renderTable(popularItems);
    }
    clearForm() {
        document.getElementById('item-form').reset();
        document.getElementById('item-id').value = '';
        document.getElementById('item-id').disabled = false;
    }
    showMessage(msg) {
        // 用innerHTML显示临时消息（替代alert）
        const msgDiv = document.createElement('div');
        msgDiv.innerText = msg;
        msgDiv.style.position = 'fixed';
        msgDiv.style.bottom = '20px';
        msgDiv.style.right = '20px';
        msgDiv.style.backgroundColor = '#28a745';
        msgDiv.style.color = 'white';
        msgDiv.style.padding = '10px 20px';
        msgDiv.style.borderRadius = '8px';
        msgDiv.style.zIndex = '1000';
        document.body.appendChild(msgDiv);
        setTimeout(() => msgDiv.remove(), 2000);
    }
}
// 启动应用
new InventoryManager();
