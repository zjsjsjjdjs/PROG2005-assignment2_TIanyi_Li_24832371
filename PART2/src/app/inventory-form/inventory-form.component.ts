import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { InventoryService } from '../inventory.service';
import { InventoryItem, Category, StockStatus } from '../models/item.model';   //

@Component({
  selector: 'app-inventory-form',
  templateUrl: './inventory-form.component.html',
  styleUrls: ['./inventory-form.component.css']
})
export class InventoryFormComponent implements OnInit {
  item: InventoryItem = {
    id: '',
    name: '',
    category: 'Electronics',
    quantity: 0,
    price: 0,
    supplier: '',
    stockStatus: 'In Stock',
    popular: 'No',
    comment: ''
  };
  isEditMode = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private inventoryService: InventoryService
  ) { }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEditMode = true;
      const existing = this.inventoryService.getItemById(id);
      if (existing) {
        this.item = { ...existing };
      } else {
        this.router.navigate(['/form']);
      }
    }
  }

  onSubmit(): void {
    if (this.isEditMode) {
      if (this.inventoryService.updateItem(this.item)) {
        alert('Item updated successfully');
        this.router.navigate(['/']);
      } else {
        alert('Update failed');
      }
    } else {
      if (this.inventoryService.addItem(this.item)) {
        alert('Item added successfully');
        this.router.navigate(['/']);
      } else {
        alert('Item ID already exists. Please use a unique ID.');
      }
    }
  }

  cancel(): void {
    this.router.navigate(['/']);
  }
}