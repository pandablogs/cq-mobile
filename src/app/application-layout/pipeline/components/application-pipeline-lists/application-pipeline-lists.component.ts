import { Component } from '@angular/core';

@Component({
  selector: 'app-application-pipeline-lists',
  standalone: false,
  templateUrl: './application-pipeline-lists.component.html',
  styleUrl: './application-pipeline-lists.component.scss',
})
export class ApplicationPipelineListsComponent {
  data = [
    {
      status: 'Paid Off',
      date: '06/25/2024 11:28 PM',
      white_label: 'Legacy Preferred Lending, LLC',
      name: {
        first_name: 'Richard',
        last_name: 'Lin',
      },
      property_address: '7219 Dahlia St, Houston, Texas, 77012',
      entity_name: 'LINCO MANAGEMENT',
      loan_program: 'LINCO MANAGEMENT',
      loan_type: 'LINCO MANAGEMENT',
      initial_funding: 'LINCO MANAGEMENT',
      repair_budget: 'LINCO MANAGEMENT',
      total_loan_amount: 'LINCO MANAGEMENT',
      actual_closing_date: 'LINCO MANAGEMENT',
      arv: 'LINCO MANAGEMENT',
      loan_officer: 'LINCO MANAGEMENT',
      total_origination: 'LINCO MANAGEMENT',
    },
    {
      status: 'Paid Off',
      date: '06/25/2024 11:28 PM',
      white_label: 'Legacy Preferred Lending, LLC',
      name: {
        first_name: 'Richard',
        last_name: 'Lin',
      },
      property_address: '7219 Dahlia St, Houston, Texas, 77012',
      entity_name: 'LINCO MANAGEMENT',
      loan_program: 'LINCO MANAGEMENT',
      loan_type: 'LINCO MANAGEMENT',
      initial_funding: 'LINCO MANAGEMENT',
      repair_budget: 'LINCO MANAGEMENT',
      total_loan_amount: 'LINCO MANAGEMENT',
      actual_closing_date: 'LINCO MANAGEMENT',
      arv: 'LINCO MANAGEMENT',
      loan_officer: 'LINCO MANAGEMENT',
      total_origination: 'LINCO MANAGEMENT',
    },
    {
      status: 'Paid Off',
      date: '06/25/2024 11:28 PM',
      white_label: 'Legacy Preferred Lending, LLC',
      name: {
        first_name: 'Richard',
        last_name: 'Lin',
      },
      property_address: '7219 Dahlia St, Houston, Texas, 77012',
      entity_name: 'LINCO MANAGEMENT',
      loan_program: 'LINCO MANAGEMENT',
      loan_type: 'LINCO MANAGEMENT',
      initial_funding: 'LINCO MANAGEMENT',
      repair_budget: 'LINCO MANAGEMENT',
      total_loan_amount: 'LINCO MANAGEMENT',
      actual_closing_date: 'LINCO MANAGEMENT',
      arv: 'LINCO MANAGEMENT',
      loan_officer: 'LINCO MANAGEMENT',
      total_origination: 'LINCO MANAGEMENT',
    },
    {
      status: 'Paid Off',
      date: '06/25/2024 11:28 PM',
      white_label: 'Legacy Preferred Lending, LLC',
      name: {
        first_name: 'Richard',
        last_name: 'Lin',
      },
      property_address: '7219 Dahlia St, Houston, Texas, 77012',
      entity_name: 'LINCO MANAGEMENT',
      loan_program: 'LINCO MANAGEMENT',
      loan_type: 'LINCO MANAGEMENT',
      initial_funding: 'LINCO MANAGEMENT',
      repair_budget: 'LINCO MANAGEMENT',
      total_loan_amount: 'LINCO MANAGEMENT',
      actual_closing_date: 'LINCO MANAGEMENT',
      arv: 'LINCO MANAGEMENT',
      loan_officer: 'LINCO MANAGEMENT',
      total_origination: 'LINCO MANAGEMENT',
    },
    {
      status: 'Paid Off',
      date: '06/25/2024 11:28 PM',
      white_label: 'Legacy Preferred Lending, LLC',
      name: {
        first_name: 'Richard',
        last_name: 'Lin',
      },
      property_address: '7219 Dahlia St, Houston, Texas, 77012',
      entity_name: 'LINCO MANAGEMENT',
      loan_program: 'LINCO MANAGEMENT',
      loan_type: 'LINCO MANAGEMENT',
      initial_funding: 'LINCO MANAGEMENT',
      repair_budget: 'LINCO MANAGEMENT',
      total_loan_amount: 'LINCO MANAGEMENT',
      actual_closing_date: 'LINCO MANAGEMENT',
      arv: 'LINCO MANAGEMENT',
      loan_officer: 'LINCO MANAGEMENT',
      total_origination: 'LINCO MANAGEMENT',
    },
  ];

  toggleDrawer() {
    const drawer = document.getElementById('view-data-side-drawer') as HTMLElement;
    drawer.classList.toggle('open');
  }
}
