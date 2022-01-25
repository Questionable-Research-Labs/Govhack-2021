/// The popup requires HTML in the form of a string,

import { ExposerType, Feature } from "./loiData";

/// so this generates a table with a title of all the data.
export function generatePopup(dataTable: Feature): string {
    let output = "";

    // For Non-official data, we want to show that it is non-official.
    if (!dataTable.properties.official) {
        output += `
			<style>
				.leaflet-popup-content-wrapper {
					border-top: solid 5px #ffcc00;
					border-bottom: solid 5px #ffcc00;
				}
				.leaflet-container .leaflet-popup-close-button {
					top: 10px !important;
				}
			</style>
			`
    }

    // Share Button
    let copyPrompt = "Copy URL";
    let copiedPrompt = "Copied!";
    let shareURL = `window.location.href + '?marker=${dataTable.properties.id}'`;
    let desktopButtonJS = `
			navigator.clipboard.writeText(${shareURL});
			var shareButton = document.getElementById('leaflet-popup-share-button');
			shareButton.ariaLabel='${copiedPrompt}';
			shareButton.addEventListener('mouseout', function( e ) {setTimeout(function() {e.target.ariaLabel = '${copyPrompt}'}, 300);});
		`;
    let mobileButtonJS = `
			navigator.share({
				title: 'toi.qrl.nz',
				text: '${dataTable.properties.eventName} | Location of Interest:',
				url: ${shareURL},
			});
		`;
    let buttonJS = `
			if (navigator.share) {
				${mobileButtonJS}
			} else {
				${desktopButtonJS}
			}
		`;
    output += `
			<span class="leaflet-popup-share-button-wrapper">
				<button id="leaflet-popup-share-button" onclick="${buttonJS}" class="leaflet-container leaflet-popup-close-button leaflet-popup-share-button" aria-label="${copyPrompt}">
					<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-share-fill" viewBox="0 0 16 16">
						<path d="M11 2.5a2.5 2.5 0 1 1 .603 1.628l-6.718 3.12a2.499 2.499 0 0 1 0 1.504l6.718 3.12a2.5 2.5 0 1 1-.488.876l-6.718-3.12a2.5 2.5 0 1 1 0-3.256l6.718-3.12A2.5 2.5 0 0 1 11 2.5z"/>
					</svg>
				</button>
			</span>
		`;

    // Title
    output += `<p>${dataTable.properties.eventName}</p>`;

    // Start table
    output += '<table>';
    /// Templates a table row with a key value pair
    const tableLineGen = (key: string, value: string | Date) => {
        if (value !== null) {
            output += `<tr><td>${key}</td><td>${value}</td></tr>`;
        }
    };
    const linkGen = (link: string, text: string) => {
        return `<a target='none' href='${link}''>${text}</a><br>`;
    };

    // Add table info
    tableLineGen('City', dataTable.location.city);
    tableLineGen('Location', `${dataTable.location.address}<br/>${linkGen(`https://maps.google.com/maps?q=&layer=c&cbll=${dataTable.location.coordinates[0]},${dataTable.location.coordinates[1]}`, 'View in Google Streetview')}`);
    if (dataTable.properties.dateAdded.isValid()) {
        tableLineGen('Date Added', `${dataTable.properties.dateAdded.format('YYYY-MM-D LT')}`);
    } else {
        tableLineGen('Date Added', 'Not specified');
    }
    if (dataTable.properties.updated.isValid()) {
        tableLineGen('Updated', dataTable.properties.updated.format('YYYY-MM-D LT'));
    }
    tableLineGen('Advice', dataTable.properties.publicAdvice);
    tableLineGen('Start', `${dataTable.properties.start.format('YYYY-MM-D LT')}`);
    tableLineGen('End', `${dataTable.properties.end.format('YYYY-MM-D LT')}`);
    if (!dataTable.properties.official) {
        tableLineGen('Status', 'Community Self Notification');
    }
    // End table
    output += '</table>';
    // Start link section
    output += '<p>';

    // More Info link (Used in community pins)
    if (typeof dataTable.properties.infoLink !== 'undefined') {
        output += linkGen(dataTable.properties.infoLink, 'View More Info');
    }
    // Add link to google maps
    output += '</p>';

    if (dataTable.properties.visibleInWebform) {
        output += `
        <a target="_blank" rel="nofollow noopener" href="https://tracing.covid19.govt.nz/loi?eventId=${dataTable.properties.id}" class="register-details">
            <div class="register-details-inner">
            People who where at this location are being asked to register their details with contact tracers with this form.
            </div>
            <div class="register-details-action">Register Now</div>
        </a>`
    }

    if (dataTable.properties.exposerType !== ExposerType.Unknown) {
        output += `
        <a target="_blank" rel="nofollow noopener" href="https://www.health.govt.nz/our-work/diseases-and-conditions/covid-19-novel-coronavirus/covid-19-health-advice-public/contact-tracing-covid-19#typesofcontacts" title="More Info">    
            <div class="exposer-type-bar" style="border-bottom: 5px solid ${ExposerType.toColor(dataTable.properties.exposerType)};">
                ${dataTable.properties.exposerType} Contact
            </div>
        </a>
        `
    }

    return output;
}