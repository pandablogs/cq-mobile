import { Component } from '@angular/core';

@Component({
  selector: 'app-pipeline',
  standalone: false,
  templateUrl: './pipeline.component.html',
  styleUrl: './pipeline.component.scss',
})
export class PipelineComponent {
  activeTab: string = 'All';
  activeFilter:string = 'status';
  internal_status_list = [
    { name: 'All', count: 1021 },
    { name: 'Lead', count: 4 },
    { name: 'Initial Underwriting', count: 17 },
    { name: 'Underwriting Hold', count: 5 },
    { name: 'Pending Committed', count: 3 },
    { name: 'Committed', count: 14 },
    { name: 'Committed Hold', count: 4 },
    { name: 'Draw Request', count: 0 },
    { name: 'Draw Pending', count: 0 },
    { name: 'Active', count: 317 },
    { name: 'Pay Off Requested', count: 0 },
    { name: 'Pay Off Sent / Pending Closing', count: 0 },
    { name: 'Paid Off', count: 229 },
    { name: 'Archived', count: 393 },
    { name: 'Foreclosed', count: 0 },
    { name: 'Pre-Lead', count: 11 },
    { name: 'REO', count: 22 },
    { name: 'Non-Direct/Broker', count: 2 },
  ];

  whiteLabelList = [
    {
        "_id": "6582b252f1276f741efdbd48",
        "name": "Quick Lending, LLC",
        "address": "2050 West Sam Houston Parkway South, Suite 1710, Houston, Texas 77042",
        "phone_number": "3462001232",
        "media_type": "image/png",
        "media_url": "white_label_vendors/1703064146123",
        "is_visible": "true",
        "full_name": "a Texas Limited Liability Company",
        "participation_signer": {
            "signatory": "James Behanick",
            "signatory_title": "Managing Member",
            "signatory_email": "james@quicklending.com",
            "signatory_mobile": "8329227836",
            "signatory_type": "Participant"
        }
    },
    {
        "_id": "6582f6afa7b89f057f5493a1",
        "name": "Legacy Preferred Lending, LLC",
        "address": "8910 Cardwell Ln Houston TX, 77055",
        "phone_number": "9194023160",
        "media_type": "image/png",
        "media_url": "white_label_vendors/1703085834346",
        "is_visible": "true",
        "full_name": "a Texas Limited Liability Company",
        "draw_emails": [
            {
                "email": "sydney@legacypreferredlending.com",
                "_id": 1716891153153
            },
            {
                "email": "will@legacypreferredlending.com",
                "_id": 1716891161563
            }
        ],
        "participation_signer": {
            "signatory": "Jeff Whitespeare",
            "signatory_title": "Managing Member",
            "signatory_email": "jeff@legacypreferredlending.com",
            "signatory_mobile": "7138587686",
            "signatory_type": "Participant"
        }
    },
    {
        "_id": "65a6abe006d27e5256f7207e",
        "name": "CQ Servicing",
        "address": "2050 West Sam Houston Parkway South, Suite 1710, Houston, TX 77042",
        "phone_number": "7133340762",
        "media_type": "image/png",
        "media_url": "white_label_vendors/1716187425434",
        "is_visible": "false",
        "full_name": "CQ Servicing"
    },
    {
        "_id": "65aaa0b8f5f5400442109d17",
        "name": "Spark Lending, LLC",
        "address": "2404 S Grand Blvd, Suite 215, Pearland, TX 77581",
        "phone_number": "8324902417",
        "media_type": "image/png",
        "media_url": "white_label_vendors/1705681080690",
        "is_visible": "true",
        "full_name": "a Texas Limited Liability Company",
        "participation_signer": {
            "signatory": "Joe Davis",
            "signatory_title": "Managing Member",
            "signatory_email": "joe@sparklending.com",
            "signatory_mobile": "8325478983",
            "signatory_type": "Participant"
        }
    },
    {
        "_id": "65aec9a4bf3eb3215f48b0ee",
        "name": "Texas Real Estate Fund I, LP",
        "address": "2050 West Sam Houston Parkway South, Suite 1710, Houston TX 77042.",
        "phone_number": "3462001232",
        "media_type": "image/png",
        "media_url": "white_label_vendors/1727933038450",
        "full_name": "a Delaware Limited Partnership",
        "participation_signer": {
            "signatory": "James Behanick",
            "signatory_title": "Managing Member",
            "signatory_email": "james@quicklending.com",
            "signatory_mobile": "8329227836",
            "signatory_type": "Lender"
        },
        "is_visible": "true"
    },
    {
        "_id": "65c0b8187b7cedc34f504f8b",
        "name": "Freedom Hawk Equity, LLC",
        "address": "3815 Garrott St #202, Houston, TX 77006, United States",
        "phone_number": "2819688245",
        "media_type": "image/png",
        "media_url": "white_label_vendors/1707128854781",
        "is_visible": "true",
        "full_name": "a Texas Limited Liability Company"
    },
    {
        "_id": "66711a67bf22ff3708666cd5",
        "name": "Parallel Lending, LLC",
        "full_name": "a Texas Limited Liability Company",
        "address": "Fort Worth, TX ",
        "phone_number": "8329228812",
        "media_type": "image/png",
        "media_url": "white_label_vendors/1718688358843",
        "is_visible": "true",
        "participation_signer": {
            "signatory": "Alex Boshart",
            "signatory_title": "Managing Member",
            "signatory_email": "alex@parallellending.com",
            "signatory_mobile": "8329225094",
            "signatory_type": "Participant"
        }
    },
    {
        "_id": "6686609b04c3b10716fc61e2",
        "name": "AGS Lending Partners",
        "full_name": "a Texas Limited Liability Company",
        "address": "9896 Bissonnet; Ste 131; Houston, TX 77036",
        "phone_number": "8883895122",
        "media_type": "image/png",
        "media_url": "white_label_vendors/1720084173983",
        "is_visible": "true"
    },
    {
        "_id": "66b6f1f080e8a372a777545f",
        "name": "Boxwood Mortgage LLC",
        "full_name": "a Texas Limited Liability Company",
        "address": "2700 Post Oak Blvd # 21, Houston TX 77056",
        "phone_number": "8325328202",
        "media_type": "image/png",
        "media_url": "white_label_vendors/1723274770971",
        "is_visible": "true"
    },
    {
        "_id": "66f1861fc0e53e175e209f5f",
        "name": "Financiera Moderna LLC",
        "full_name": "a Texas Limited Liability Company",
        "address": "8419 Emmett F Lowry Expy, Texas City, TX 77591",
        "phone_number": "2812991864",
        "media_type": "image/png",
        "media_url": "white_label_vendors/1727104543242",
        "draw_emails": [
            {
                "email": "greyson@moderna.email",
                "_id": 1727104568890
            }
        ],
        "is_visible": "true",
        "login_info": {
            "email": "greyson@moderna.email",
            "password": "1234"
        },
        "servicing_agreement": {
            "white_labeler_name": "Financiera Moderna LLC",
            "white_labeler_business_phone": "2812991864",
            "white_labeler_names": "Greyson Womack",
            "white_labeler_business_email": "greyson@moderna.email",
            "white_labeler_cell_phone": "2812991864",
            "white_labeler_mailing_address": "8419 Emmett F Lowry Expy, Texas City, TX 77591",
            "white_labeler_ein": "88-1898134",
            "demand_sent_on_twenty": true,
            "refer_account_to_cq_servicing": true,
            "authorization_white_label_lender": "Financiera Moderna LLC",
            "authorization_telephone_number": "281-299-1864",
            "authorization_printed_name": "Financiera Moderna ",
            "funds_direct_deposited": true,
            "ach_form_completed": true,
            "name_on_account": "FINANCIERA MODERNA LLC",
            "account_code": "0407",
            "mailing_address": "12026 Flushing Meadows Drive, Houston, TX, 77089",
            "business_phone_number": "2812991864",
            "business_email_address": "greyson@moderna.email",
            "business_cell_phone": "2812991864",
            "bank_name": "Wells Fargo Bank, N.A.",
            "account_number": "3300400334",
            "routing_number": "121000248",
            "bank_representative_name": "Armando Garza",
            "telephone_number": "281-316-7380",
            "account_type": "Checking",
            "account_name_title": "FINANCIERA MODERNA LLC",
            "ach_printed_name": "Greyson George Womack",
            "white_label_signer_name": "Greyson George Womack",
            "white_label_signer_title": "President ",
            "texas_signer": {
                "_id": "650d9c72beb98c7480aa1d44",
                "name": "James Behanick ",
                "date_updated": "2024-03-18T06:45:54.560Z",
                "signature_media_type": "image/jpeg",
                "signature_url": "loans/1710740258240",
                "original_signature_media_type": "image/jpeg",
                "original_signature_url": "loans/1710744354391"
            },
            "cq_signer": {
                "_id": "658452304b0b4c14cea893bf",
                "name": "Ivannia Recio",
                "date_updated": "2024-03-18T06:48:23.899Z",
                "signature_media_type": "image/jpeg",
                "signature_url": "loans/1710740580070",
                "original_signature_media_type": "image/jpeg",
                "original_signature_url": "loans/1710744503633"
            }
        },
        "signature_data": {
            "docusign_envelope_id": "bdc41e5e-bb41-4080-aa76-d809cb54d945",
            "sent_time": "2024-09-25T12:55:56.011Z",
            "signature_status": "Sent for Signature",
            "signer": {
                "email": "greyson@moderna.email",
                "name": "Greyson George Womack"
            }
        }
    },
    {
        "_id": "66f409b383a9d33f8b5680c3",
        "name": "T.I.F",
        "full_name": "a Texas Limited Liability Company",
        "address": "P.O. BOX 12221, College Station, Texas 77842",
        "phone_number": "2818140665",
        "media_type": "image/png",
        "media_url": "white_label_vendors/1727687240562",
        "login_info": {
            "email": "jeff.mazzolini@gmail.com",
            "password": "0665"
        },
        "is_visible": "true",
        "documents": [
            {
                "name": "T.I.F Company Agreement",
                "_id": "66f40aef83a9d33f8b5680d0",
                "date_added": "2024-09-25T13:06:55.802Z",
                "date_updated": "2024-09-25T13:06:55.802Z",
                "media_type": "application/pdf",
                "media_url": "white_label_vendors/1727269615802"
            },
            {
                "name": "T.I.F EIN",
                "_id": "66f40afe83a9d33f8b5680d1",
                "date_added": "2024-09-25T13:07:10.661Z",
                "date_updated": "2024-09-25T13:07:10.661Z",
                "media_type": "application/pdf",
                "media_url": "white_label_vendors/1727269630661"
            },
            {
                "name": "T.I.F Certificate of Filing",
                "_id": "66f40b1283a9d33f8b5680d5",
                "date_added": "2024-09-25T13:07:30.875Z",
                "date_updated": "2024-09-25T13:07:30.875Z",
                "media_type": "application/pdf",
                "media_url": "white_label_vendors/1727269650875"
            },
            {
                "name": "T.I.F Certificate of Fact",
                "_id": "66f40b2f83a9d33f8b5680d6",
                "date_added": "2024-09-25T13:07:59.379Z",
                "date_updated": "2024-09-25T13:07:59.379Z",
                "media_type": "application/pdf",
                "media_url": "white_label_vendors/1727269679379"
            },
            {
                "name": "T.I.F Logo",
                "_id": "66f40b4a83a9d33f8b5680d7",
                "date_added": "2024-09-25T13:08:26.803Z",
                "date_updated": "2024-09-25T13:08:26.803Z",
                "media_type": "image/svg+xml",
                "media_url": "white_label_vendors/1727269706803"
            }
        ],
        "servicing_agreement": {
            "white_labeler_name": "TIF, LLC",
            "white_labeler_business_phone": "2818140665",
            "white_labeler_names": "Jeff Mazzolini",
            "white_labeler_business_email": "jeff.mazzolini@gmail.com",
            "white_labeler_cell_phone": "2818140665",
            "white_labeler_mailing_address": "P.O. BOX 12221, College Station, Texas 77842",
            "white_labeler_ein": "82-3669176",
            "demand_sent_on_twenty": true,
            "refer_account_to_cq_servicing": true,
            "authorization_white_label_lender": "TIF, LLC",
            "authorization_telephone_number": "281.814.0665",
            "authorization_printed_name": "Jeff Mazzolini",
            "funds_direct_deposited": true,
            "ach_form_completed": true,
            "name_on_account": "TIF, LLC",
            "account_code": "0",
            "mailing_address": "15720 Buffalo Creek Loop, College Station, TX 77845",
            "business_phone_number": "2818140665",
            "business_email_address": "info@texasinvestorfinancing.com",
            "business_cell_phone": "2818140665",
            "bank_name": "Chase Bank",
            "account_number": "932139962",
            "routing_number": "111000614",
            "bank_representative_name": "Casey Lively-Crowley",
            "telephone_number": "9796908295",
            "account_type": "Checking",
            "account_name_title": "Jeff Mazzolini, Manager",
            "ach_printed_name": "Jeff Mazzolini",
            "white_label_signer_name": "Jeff Mazzolini",
            "white_label_signer_title": "Manager"
        },
        "signature_data": {
            "docusign_envelope_id": "da539526-c106-47c9-a2e0-83117f7573af",
            "sent_time": "2024-09-25T18:09:02.480Z",
            "signature_status": "Signed",
            "signer": {
                "email": "jeff.mazzolini@gmail.com",
                "name": "Jeff Mazzolini"
            },
            "signed_document_url": "white_label_vendors/1727298089116",
            "signed_time": "2024-09-25T21:01:29.442Z"
        }
    },
    {
        "_id": "66f6506eeae62645ccee7788",
        "name": "Sierra Vista Realty",
        "full_name": "Sierra Vista Realty",
        "address": "6633 Gulf Fwy, Houston, TX 77087, United States",
        "phone_number": "8328951618",
        "media_type": "image/png",
        "media_url": "white_label_vendors/1727418477821",
        "is_visible": "true"
    }
]


  loanTypeFilter(tab: string, event: any) {
    this.activeTab = tab;
    const element: any = event.target as HTMLElement;
    element.scrollIntoView({
      behavior: 'smooth',
      block: 'nearest',
      inline: 'center',
    });
  }

  scrollLeft() {
    const scrollContainer: any = document.querySelector(
      '.type-filters'
    ) as HTMLElement;
    scrollContainer.scrollBy({ left: -100, behavior: 'smooth' }); // Scroll left by 100px
  }

  scrollRight() {
    const scrollContainer: any = document.querySelector(
      '.type-filters'
    ) as HTMLElement;
    scrollContainer.scrollBy({ left: 100, behavior: 'smooth' }); // Scroll right by 100px
  }

  toggleDrawer() {
    const drawer = document.getElementById('filter-side-drawer') as HTMLElement;
    drawer.classList.toggle('open');
  }

  changeFilterCreiteria(tab:any){
    this.activeFilter = tab;
  }
}
