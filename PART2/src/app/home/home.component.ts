import { Component, OnInit } from '@angular/core';
import { InventoryService } from '../inventory.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  totalItems = 0;
  popularCount = 0;

  constructor(private inventoryService: InventoryService) { }

  ngOnInit(): void {
    this.totalItems = this.inventoryService.getItems().length;
    this.popularCount = this.inventoryService.getPopularItems().length;
  }
}