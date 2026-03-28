// 定义物品类型
type Category = 'Electronics' | 'Furniture' | 'Clothing' | 'Tools' | 'Miscellaneous';
type StockStatus = 'In Stock' | 'Low Stock' | 'Out of Stock';

interface InventoryItem {
    id: string;
    name: string;
    category: Category;
    quantity: number;
    price: number;
    supplier: string;
    stockStatus: StockStatus;
    popular: 'Yes' | 'No';
    comment?: string;
}

class InventoryManager {
    private items: InventoryItem[] = [];
    private editMode = false;
    private editItemId: string | null = null;

    constructor() {
        this.initSampleData();
        this.bindEvents();
        this.renderTable();
    }

    private initSampleData(): void {
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

    private bindEvents(): void {
        const form = document.getElementById('item-form') as HTMLFormElement;
        form.addEventListener('submit', (e) => this.handleSubmit(e));

        document.getElementById('search-btn')?.addEventListener('click', () => this.searchByName());
        document.getElementById('show-all-btn')?.addEventListener('click', () => this.renderTable());
        document.getElementById('show-popular-btn')?.addEventListener('click', () => this.renderPopular());
        document.getElementById('cancel-edit')?.addEventListener('click', () => this.cancelEdit());
        document.getElementById('search-name')?.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.searchByName();
        });
    }

    private handleSubmit(e: Event): void {
        e.preventDefault();
        const form = e.target as HTMLFormElement;
        const idInput = document.getElementById('item-id') as HTMLInputElement;
        const nameInput = document.getElementById('item-name') as HTMLInputElement;
        const categorySelect = document.getElementById('category') as HTMLSelectElement;
        const quantityInput = document.getElementById('quantity') as HTMLInputElement;
        const priceInput = document.getElementById('price') as HTMLInputElement;
        const supplierInput = document.getElementById('supplier') as HTMLInputElement;
        const stockSelect = document.getElementById('stock-status') as HTMLSelectElement;
        const popularSelect = document.getElementById('popular') as HTMLSelectElement;
        const commentText = document.getElementById('comment') as HTMLTextAreaElement;

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

        const newItem: InventoryItem = {
            id: idInput.value.trim(),
            name: nameInput.value.trim(),
            category: categorySelect.value as Category,
            quantity,
            price,
            supplier: supplierInput.value.trim(),
            stockStatus: stockSelect.value as StockStatus,
            popular: popularSelect.value as 'Yes' | 'No',
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
        } else {
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

    private editItem(id: string): void {
        const item = this.items.find(i => i.id === id);
        if (!item) return;

        this.editMode = true;
        this.editItemId = id;

        // 填充表单
        (document.getElementById('item-id') as HTMLInputElement).value = item.id;
        (document.getElementById('item-name') as HTMLInputElement).value = item.name;
        (document.getElementById('category') as HTMLSelectElement).value = item.category;
        (document.getElementById('quantity') as HTMLInputElement).value = item.quantity.toString();
        (document.getElementById('price') as HTMLInputElement).value = item.price.toString();
        (document.getElementById('supplier') as HTMLInputElement).value = item.supplier;
        (document.getElementById('stock-status') as HTMLSelectElement).value = item.stockStatus;
        (document.getElementById('popular') as HTMLSelectElement).value = item.popular;
        (document.getElementById('comment') as HTMLTextAreaElement).value = item.comment || '';

        (document.getElementById('form-title') as HTMLElement).innerText = 'Edit Item';
        (document.getElementById('submit-btn') as HTMLButtonElement).innerText = 'Update Item';
        (document.getElementById('cancel-edit') as HTMLButtonElement).style.display = 'inline-block';
        (document.getElementById('item-id') as HTMLInputElement).disabled = true; // 禁止修改ID
    }

    private cancelEdit(): void {
        this.editMode = false;
        this.editItemId = null;
        this.clearForm();
        (document.getElementById('form-title') as HTMLElement).innerText = 'Add New Item';
        (document.getElementById('submit-btn') as HTMLButtonElement).innerText = 'Add Item';
        (document.getElementById('cancel-edit') as HTMLButtonElement).style.display = 'none';
        (document.getElementById('item-id') as HTMLInputElement).disabled = false;
    }

    private deleteItem(id: string): void {
        const item = this.items.find(i => i.id === id);
        if (item && confirm(`Are you sure you want to delete "${item.name}"?`)) {
            this.items = this.items.filter(i => i.id !== id);
            this.renderTable();
            this.showMessage('Item deleted');
            if (this.editMode && this.editItemId === id) this.cancelEdit();
        }
    }

    private searchByName(): void {
        const searchTerm = (document.getElementById('search-name') as HTMLInputElement).value.trim().toLowerCase();
        if (!searchTerm) {
            this.renderTable();
            return;
        }
        const filtered = this.items.filter(item => item.name.toLowerCase().includes(searchTerm));
        this.renderTable(filtered);
    }

    private renderTable(itemsToRender: InventoryItem[] = this.items): void {
        const container = document.getElementById('inventory-table');
        if (!container) return;

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
                const id = (e.currentTarget as HTMLElement).getAttribute('data-id');
                if (id) this.editItem(id);
            });
        });
        document.querySelectorAll('.delete-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const id = (e.currentTarget as HTMLElement).getAttribute('data-id');
                if (id) this.deleteItem(id);
            });
        });
    }

    private renderPopular(): void {
        const popularItems = this.items.filter(item => item.popular === 'Yes');
        this.renderTable(popularItems);
    }

    private clearForm(): void {
        (document.getElementById('item-form') as HTMLFormElement).reset();
        (document.getElementById('item-id') as HTMLInputElement).value = '';
        (document.getElementById('item-id') as HTMLInputElement).disabled = false;
    }

    private showMessage(msg: string): void {
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