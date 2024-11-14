<table>
    <tr>
        <td colspan="5" style="text-align: center">Laporan Sensor Data</td>
    </tr>
    <tr>
        <td></td>
        <td></td>
        <td></td>
        <td></td>
        <td></td>
    </tr>
    <tr>
        <td>
            Tanggal
        </td>
        <td>
            :
        </td>
        <td>
            @if ($date)
                {{ $date }}
            @endif
        </td>

    </tr>
    <tr>
        <td>
            Status
        </td>
        <td>
            :
        </td>
        <td>
            @if ($status != 'all')
                {{ $status }}
            @endif
        </td>

    </tr>
    <tr>
        <td></td>
        <td></td>
        <td></td>
        <td></td>
        <td></td>
    </tr>
    <tr>
        <th width="25" style="text-align: center">Tanggal</th>
        <th width="10" style="text-align: center">Suhu</th>
        <th width="13" style="text-align: center">Temperatur</th>
        <th width="10" style="text-align: center">Status A</th>
        <th width="10" style="text-align: center">Status B</th>
    </tr>

    @foreach ($items as $item)
        <tr>
            <td>
                {{ $item->created_at->translatedFormat('d/m/Y H:i:s') }}
            </td>
            <td style="text-align: center">{{ $item->suhu }} C</td>
            <td style="text-align: center">{{ $item->temperature }} C</td>
            <td style="text-align: center">
                @if ($item->status_a == 1)
                    On
                @else
                    Off
                @endif
            </td>
            <td style="text-align: center">
                @if ($item->status_b == 1)
                    On
                @else
                    Off
                @endif
            </td>
        </tr>
    @endforeach

</table>
